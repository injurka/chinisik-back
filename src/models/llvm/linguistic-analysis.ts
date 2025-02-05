import type { z } from '@hono/zod-openapi'
import type { LlvmLinguisticAnalysisSchema } from './linguistic-analysis.schema'

interface LlvmLinguisticAnalysisSourceType {
  type: 'sentence' | 'word'
  cn: string
}

type LlvmLinguisticAnalysis = z.infer<typeof LlvmLinguisticAnalysisSchema>

export type {
  LlvmLinguisticAnalysis,
  LlvmLinguisticAnalysisSourceType,
}
