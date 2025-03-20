import type { ToneType } from '../shared'
import type { SplitGlyphsType } from './splited-glyphs'
import type { AiModel } from '~/utils/ai/request'

interface LinguisticAnalysisPayload {
  value: string
  model: AiModel
}

interface LinguisticAnalysisFlatPayload {
  value: string
  model: AiModel
  isTemplate: boolean
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
  LinguisticAnalysisFlatPayload,
  LinguisticAnalysisPayload,
  PinyinHieroglyphsPayload,
  SplitGlyphsPayload,
}
