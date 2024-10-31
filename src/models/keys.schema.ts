import { z } from '@hono/zod-openapi';
import { JsonToDomElementSchema } from '~/models/shared.schema.ts';

const ToneTypeSchema = z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3), z.literal(4)]);

const ToneSchema = z.object({
  type: ToneTypeSchema,
  index: z.number().int().nonnegative(),
});

const HieroglyphKeySchema = z.object({
  index: z.number().int().optional(),
  alternative: z.union([z.string(), z.null()]).optional(),
  tone: ToneSchema,
  pinyin: z.string(),
  glyph: z.string(),
  translate: z.string(),
  transcription: z.string().optional(),
});

const HieroglyphKeyDescriptionSchema = JsonToDomElementSchema

export {
  HieroglyphKeyDescriptionSchema,
  HieroglyphKeySchema
};
