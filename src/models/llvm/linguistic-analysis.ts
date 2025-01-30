import type { z } from '@hono/zod-openapi'
import type { LinguisticAnalysisSchema } from './linguistic-analysis.schema'

interface LinguisticAnalysisSourceType {
  type: 'sentence' | 'word'
  cn: string
}

type LinguisticAnalysis = z.infer<typeof LinguisticAnalysisSchema>

export type {
  LinguisticAnalysis,
  LinguisticAnalysisSourceType,
}
