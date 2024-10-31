type ToneType = 0 | 1 | 2 | 3 | 4

interface HieroglyphKey {
  index?: number
  alternative?: string | null
  tone: {
    type: ToneType
    index: number
  }
  pinyin: string
  glyph: string
  translate: string
  transcription?: string
}

export type {
  ToneType,
  HieroglyphKey
};
