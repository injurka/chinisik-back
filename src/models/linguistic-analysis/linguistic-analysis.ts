import type { z } from '@hono/zod-openapi'
import type { LinguisticAnalysisSchema } from './linguistic-analysis.schema'

type LinguisticAnalysis = z.infer<typeof LinguisticAnalysisSchema>

export type { LinguisticAnalysis }
