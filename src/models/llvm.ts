type SplitGlyphsType = 'sentence' | 'word' | 'hieroglyph'

interface SplitGlyphsPayload {
  type: SplitGlyphsType
  word: string
}

export type {
  SplitGlyphsPayload,
  SplitGlyphsType,
}
