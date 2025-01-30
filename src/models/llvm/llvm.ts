import type { ToneType } from '../shared'
import type { SplitGlyphsType } from './splited-glyphs'
import type { AiModel } from '~/utils/ai'

interface LinguisticAnalysisPayload {
  value: string
  model: AiModel
}

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
  LinguisticAnalysisPayload,
  PinyinHieroglyphsPayload,
  SplitGlyphsPayload,
}
