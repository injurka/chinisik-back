import type { ToneType } from '../shared'
import type { SplitGlyphsType } from './splited-glyphs'

interface SplitGlyphsPayload {
  type: SplitGlyphsType
  glyphs: string
}

interface PinyinHieroglyphsPayload {
  tones: ToneType[]
  pinyin: string
  count?: number
}

export type {
  PinyinHieroglyphsPayload,
  SplitGlyphsPayload,
}
