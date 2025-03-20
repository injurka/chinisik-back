import type { InputJsonValue } from '@prisma/client/runtime/library'
import type { ZodSchema } from 'zod'
import type { User } from '~/models'
import type {
  LinguisticAnalysisFlatPayload,
  LinguisticAnalysisPayload,
  LlvmLinguisticAnalysisSourceType,
  PinyinHieroglyphsPayload,
  SplitGlyphsPayload,
} from '~/models/llvm'
import { HTTPException } from 'hono/http-exception'
import { z } from 'zod'
import {
  LlvmLinguisticAnalysisSchema,
  LlvmLinguisticAnalysisSourceTypeSchema,
  PinyinHieroglyphsSchema,
  SplitedGlyphsSchema,
} from '~/models/llvm'
import { prisma } from '~/prisma'
import { logger } from '~/server'
import { createAiEmbeddingsRequest, loadOrCreateEmbeddings } from '~/utils/ai/embeddings'
import { createAiChatRequest } from '~/utils/ai/request'
import {
  getLinguisticAnalysisMdPromt,
  getLinguisticAnalysisPromt,
  getLinguisticAnalysisTypePromt,
} from '~/utils/promt/linguistic-analysis'
import { getPrompt as getPinyinHieroglyphsPromt } from '~/utils/promt/pinyin-hieroglyphs'
import { getPrompt as getSplitGlyphsPromt } from '~/utils/promt/split-glyphs'
import { LinguisticAnalysisService } from './linguistic-analysis'

interface Item {
  glyph: string
  embedding: {
    data: Array<{
      embedding: number[]
    }>
  }
  translation?: {
    ru: string
  }
  translate?: string
  traditionalGlyph?: string
  pinyin: PinyinItem[] | string
  toneIndex?: number
  toneType?: number
}
interface PinyinItem {
  syllable: string
  position: number
  tone: number
}
interface SimilarityResult {
  glyph: string
  ru: string
  cn: string
  type: 'hsk' | 'key'
  pinyin: string | string[]
  similarity: number
}

class LlvmService {
  private processAiResponse = async <T>(
    rawData: string | undefined | null,
    schema: ZodSchema<T>,
  ): Promise<T> => {
    if (!rawData) {
      throw new Error('Failed to generate content')
    }

    try {
      const parsedData = JSON.parse(rawData)
      return schema.parse(parsedData)
    }
    catch (error) {
      const errorMessage = `Failed to format generated content. ${error}`
      logger.error(errorMessage, { rawData })
      throw new HTTPException(400, { message: errorMessage })
    }
  }

  async splitGlyphs(params: SplitGlyphsPayload) {
    const { system, user } = getSplitGlyphsPromt(params)
    const response = await createAiChatRequest({ system, user })
    const rawData = response.choices[0].message.content?.trim()

    try {
      if (!rawData)
        throw new Error('_', { cause: 'Failed to generate content.' })

      const formatedRawData = rawData.startsWith('{') ? `[${rawData}]` : rawData
      const parsedData = JSON.parse(formatedRawData)
      const validatedData = SplitedGlyphsSchema.parse(parsedData)

      return validatedData
    }
    catch (err) {
      const errMsg = `Failed to format generated content. ${err}`
      // logger.error(errMsg, rawData)
      throw new HTTPException(400, { message: errMsg })
    }
  }

  async linguisticAnalysis(params: LinguisticAnalysisPayload, user: User) {
    try {
      let totalTokens = 0
      const startTime = performance.now()

      const sourceTypeResponse = await createAiChatRequest(
        getLinguisticAnalysisTypePromt(params),
        { model: params.model },
      )
      const sourceTypeContent = sourceTypeResponse.choices[0].message.content
      totalTokens += sourceTypeResponse?.usage?.total_tokens ?? 0

      const sourceType = await this.processAiResponse<LlvmLinguisticAnalysisSourceType>(
        sourceTypeContent,
        LlvmLinguisticAnalysisSourceTypeSchema,
      )
      const glyphs = sourceType.cn.trim()

      // Загрузка эмбеддингов
      const embeddings = await loadOrCreateEmbeddings()

      // Получение эмбеддинга для входного текста
      const inputEmbedding = await createAiEmbeddingsRequest(glyphs)

      function cosineSimilarity(vecA: number[], vecB: number[]) {
        const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0)
        const normA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0))
        const normB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0))

        return dotProduct / (normA * normB)
      }

      const formatPinyin = (syllable: string, position: number, tone: number): string => {
        const pos = position + 1
        const initial = syllable.slice(0, pos)
        const final = syllable.slice(pos)

        return `${initial}${tone}${final}`
      }

      const calculateSimilarities = (
        allItems: Item[],
        inputEmbedding: { data: Array<{ embedding: number[] }> },
      ): SimilarityResult[] => {
        return allItems.map((item) => {
          const itemEmbedding = item.embedding.data[0].embedding
          const similarity = cosineSimilarity(inputEmbedding.data[0].embedding, itemEmbedding)

          const type = item.traditionalGlyph !== undefined ? 'hsk' : 'key'
          const ru = item.translation?.ru || item.translate || ''
          let pinyin: string | string[]

          if (Array.isArray(item.pinyin)) {
            pinyin = item.pinyin.map((p: PinyinItem) =>
              formatPinyin(p.syllable, p.position, p.tone),
            )
          }
          else {
            pinyin = formatPinyin(
              item.pinyin as string,
              item.toneIndex || 0,
              item.toneType || 5,
            )
          }
          return {
            glyph: item.glyph,
            ru,
            cn: item.glyph,
            type,
            pinyin,
            similarity,
          }
        })
      }

      // Поиск похожих примеров
      // Создание объединенного массива из hsk и keys для поиска
      const allItems = [...embeddings.hsk, ...embeddings.keys] as unknown as Item[]

      const similarities = calculateSimilarities(allItems, inputEmbedding)

      // Получение топ-5 похожих примеров
      const topSimilar = similarities
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, 5)

      // Формирование контекста для LLM на основе найденных похожих примеров
      const context = topSimilar.map(item => `
        Русский: "${item.ru}", 
        Китайский: "${item.cn}", 
        Тип: ${item.type}, 
        Пиньинь: ${JSON.stringify(item.pinyin)}`,
      ).join('\n')

      const systemPrompt = `
      ПРИМЕРЫ ПОХОЖИХ ИЕРОГЛИФОВ (СЛОВ) ДЛЯ ТЕКУЩЕГО ЗАПРОСА:
      ${context}
      `

      const analysisResponse = await createAiChatRequest(
        getLinguisticAnalysisPromt({ user: sourceType.cn, system: systemPrompt }),
        { model: params.model },
      )
      const analysisContent = analysisResponse.choices[0].message.content
      totalTokens += analysisResponse?.usage?.total_tokens ?? 0

      const response = await this.processAiResponse(
        analysisContent,
        LlvmLinguisticAnalysisSchema,
      )

      const endTime = performance.now()
      const generationDuration = Math.round((endTime - startTime) / 1000)

      new LinguisticAnalysisService().createJsonAnalysisRecord({
        userId: user.id,
        model: params.model,
        totalTokens,
        sourceValue: params.value,
        type: sourceType.type,
        glyph: sourceType.cn,
        jsonData: response as InputJsonValue,
        generationDuration,
      })

      return LlvmLinguisticAnalysisSchema.parse(response)
    }
    catch (error) {
      await prisma.linguisticAnalysisError.create({
        data: {
          userId: user.id,
          model: params.model,
          sourceValue: params.value,
          error: JSON.stringify((error as any).message ?? error),
        },
      })

      throw error
    }
  }

  async linguisticAnalysisFlat(params: LinguisticAnalysisFlatPayload, user: User) {
    try {
      let totalTokens = 0
      const startTime = performance.now()

      const sourceTypeResponse = await createAiChatRequest(
        getLinguisticAnalysisTypePromt(params),
        { model: params.model },
      )
      const sourceTypeContent = sourceTypeResponse.choices[0].message.content
      totalTokens += sourceTypeResponse?.usage?.total_tokens ?? 0

      const sourceType = await this.processAiResponse<LlvmLinguisticAnalysisSourceType>(
        sourceTypeContent,
        LlvmLinguisticAnalysisSourceTypeSchema,
      )
      const glyphs = sourceType.cn.trim()

      const analysisResponse = await createAiChatRequest(
        getLinguisticAnalysisMdPromt({ user: glyphs }, params.isTemplate),
        { model: params.model, response_format: { type: 'text' } },
      )
      const analysisContent = analysisResponse.choices[0].message.content
      totalTokens += analysisResponse?.usage?.total_tokens ?? 0

      const response = z.string().parse(analysisContent).replaceAll('```markdown', '').replaceAll('```', '')

      const endTime = performance.now()
      const generationDuration = Math.round((endTime - startTime) / 1000)

      new LinguisticAnalysisService().createMarkdownAnalysisRecord({
        userId: user.id,
        model: params.model,
        totalTokens,
        sourceValue: params.value,
        type: sourceType.type,
        glyph: sourceType.cn,
        markdownData: response,
        generationDuration,
      })

      return z.string().parse(response)
    }
    catch (error) {
      await prisma.linguisticAnalysisError.create({
        data: {
          userId: user.id,
          model: params.model,
          sourceValue: params.value,
          error: JSON.stringify((error as any).message ?? error),
        },
      })

      throw error
    }
  }

  async pinyinHieroglyphs(params: PinyinHieroglyphsPayload) {
    const prompt = getPinyinHieroglyphsPromt(params)
    const response = await createAiChatRequest(prompt)
    const content = response.choices[0].message.content?.trim()

    return this.processAiResponse(
      content,
      PinyinHieroglyphsSchema,
    )
  }
}

export { LlvmService }
