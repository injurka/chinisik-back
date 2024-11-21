import type { SplitGlyphsType } from './splited-glyphs'

interface SplitGlyphsPayload {
  type: SplitGlyphsType
  glyphs: string
}

export type {
  SplitGlyphsPayload,
}
