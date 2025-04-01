import { z } from '@hono/zod-openapi'
import { LlvmLinguisticAnalysisSchema } from '../llvm'

const LinguisticAnalysisSchema = z.object({
  id: z.number().int(),
  type: z.string(),
  userId: z.number().int(),
  model: z.string(),
  sourceValue: z.string(),
  glyph: z.string(),
  totalTokens: z.number().int(),
  generationDuration: z.number().int(),
  createdAt: z.date(),
  updatedAt: z.date(),
  data: LlvmLinguisticAnalysisSchema,
})

const LinguisticAnalysisAllSchema = z.object({
  id: z.number().int(),
  type: z.string(),
  userId: z.number().int(),
  model: z.string(),
  sourceValue: z.string(),
  glyph: z.string(),
  totalTokens: z.number().int(),
  generationDuration: z.number().int(),
  createdAt: z.date(),
  updatedAt: z.date(),
  dataType: z.string(),
  data: z.union([LlvmLinguisticAnalysisSchema, z.string()]),
})

export {
  LinguisticAnalysisAllSchema,
  LinguisticAnalysisSchema,
}
