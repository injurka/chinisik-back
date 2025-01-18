import { z } from '@hono/zod-openapi'

const PinyinSchema = z.object({
  value: z.string(),
  toneType: z.number().int(),
  toneIndex: z.number().int(),
})

const TranslateSchema = z.object({
  pos: z.string(),
  value: z.string(),
  freq: z.number().min(0).max(1),
})

const SentenceSchema = z.object({
  type: z.literal('sentence'),
  glyph: z.string(),
  pinyin: z.array(PinyinSchema),
  translate: z.string(),
  transcription: z.string(),
  components: z.array(z.string()),
})

const HieroglyphSchema = z.object({
  type: z.literal('hieroglyph'),
  glyph: z.string(),
  pinyin: z.string(),
  toneType: z.number().int(),
  toneIndex: z.number().int(),
  translate: z.array(TranslateSchema),
  transcription: z.string(),
  components: z.array(z.string()),
})

const WordSchema = z.object({
  type: z.literal('word'),
  glyph: z.string(),
  pinyin: z.array(PinyinSchema),
  translate: z.string(),
  transcription: z.string(),
  components: z.array(z.string()),
})

const SplitedGlyphsSchema = z.array(
  z.union([
    SentenceSchema,
    HieroglyphSchema,
    WordSchema,
  ]),
)

export {
  HieroglyphSchema,
  PinyinSchema,
  SentenceSchema,
  SplitedGlyphsSchema,
  TranslateSchema,
  WordSchema,
}
