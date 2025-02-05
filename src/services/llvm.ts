import type { InputJsonValue } from '@prisma/client/runtime/library'
import type { ZodSchema } from 'zod'
import type { User } from '~/models'
import type {
  LinguisticAnalysisPayload,
  LlvmLinguisticAnalysisSourceType,
  PinyinHieroglyphsPayload,
  SplitGlyphsPayload,
} from '~/models/llvm'
import { HTTPException } from 'hono/http-exception'
import {
  LlvmLinguisticAnalysisSchema,
  LlvmLinguisticAnalysisSourceTypeSchema,
  PinyinHieroglyphsSchema,
  SplitedGlyphsSchema,
} from '~/models/llvm'
import { prisma } from '~/prisma'
import { logger } from '~/server'
import { createAiRequest } from '~/utils/ai'
import {
  getLinguisticAnalysisPromt,
  getLinguisticAnalysisTypePromt,
} from '~/utils/promt/linguistic-analysis'
import { getPrompt as getPinyinHieroglyphsPromt } from '~/utils/promt/pinyin-hieroglyphs'
import { getPrompt as getSplitGlyphsPromt } from '~/utils/promt/split-glyphs'

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
    const response = await createAiRequest({ system, user })
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

      const sourceTypeResponse = await createAiRequest(
        getLinguisticAnalysisTypePromt(params),
        { model: params.model },
      )
      totalTokens += sourceTypeResponse?.usage?.total_tokens ?? 0

      const sourceTypeContent = sourceTypeResponse.choices[0].message.content
      const sourceType = await this.processAiResponse<LlvmLinguisticAnalysisSourceType>(
        sourceTypeContent,
        LlvmLinguisticAnalysisSourceTypeSchema,
      )

      const analysisResponse = await createAiRequest(
        getLinguisticAnalysisPromt({ value: sourceType.cn }),
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

      await prisma.linguisticAnalysisAll.create({
        data: {
          userId: user.id,
          model: params.model,
          totalTokens,
          sourceValue: params.value,
          type: sourceType.type,
          glyph: sourceType.cn,
          data: response as InputJsonValue,
          generationDuration,
        },
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

  async pinyinHieroglyphs(params: PinyinHieroglyphsPayload) {
    const prompt = getPinyinHieroglyphsPromt(params)
    const response = await createAiRequest(prompt)
    const content = response.choices[0].message.content?.trim()

    return this.processAiResponse(
      content,
      PinyinHieroglyphsSchema,
    )
  }
}

export { LlvmService }
