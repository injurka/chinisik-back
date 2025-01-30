import type { ZodSchema } from 'zod'
import type {
  LinguisticAnalysisPayload,
  LinguisticAnalysisSourceType,
  PinyinHieroglyphsPayload,
} from '~/models/llvm'
import { HTTPException } from 'hono/http-exception'
import {
  LinguisticAnalysisSchema,
  LinguisticAnalysisSourceTypeSchema,
  PinyinHieroglyphsSchema,
} from '~/models/llvm'
import { logger } from '~/server'
import { createAiRequest } from '~/utils/ai'
import {
  getLinguisticAnalysisPromt,
  getLinguisticAnalysisTypePromt,
} from '~/utils/promt/linguistic-analysis'
import { getPrompt as getPinyinHieroglyphsPromt } from '~/utils/promt/pinyin-hieroglyphs'

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

  async linguisticAnalysis(params: LinguisticAnalysisPayload) {
    const sourceTypeResponse = await createAiRequest(
      getLinguisticAnalysisTypePromt(params),
    )
    const sourceTypeContent = sourceTypeResponse.choices[0].message.content
    const sourceType = await this.processAiResponse<LinguisticAnalysisSourceType>(
      sourceTypeContent,
      LinguisticAnalysisSourceTypeSchema,
    )

    const analysisResponse = await createAiRequest(
      getLinguisticAnalysisPromt({ value: sourceType.cn }),
      { model: params.model },
    )
    const analysisContent = analysisResponse.choices[0].message.content

    return this.processAiResponse(
      analysisContent,
      LinguisticAnalysisSchema,
    )
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
