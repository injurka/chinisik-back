import { z } from '@hono/zod-openapi'

const ToneTypeSchema = z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3), z.literal(4)])

const HieroglyphKeySchema = z.object({
  index: z.number().int().optional(),
  alternative: z.union([z.string(), z.null()]).optional(),
  toneType: ToneTypeSchema,
  toneIndex: z.number().int().nonnegative(),
  pinyin: z.string(),
  glyph: z.string(),
  translate: z.string(),
  transcription: z.string().optional(),
})

export {
  HieroglyphKeySchema,
}
