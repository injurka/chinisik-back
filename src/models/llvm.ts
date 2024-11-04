import type { SplitGlyphsType } from './splited-glyphs'

interface SplitGlyphsPayload {
  type: SplitGlyphsType
  word: string
}

export type {
  SplitGlyphsPayload,
}
