import type { ToneType } from '../shared'
import type { SplitGlyphsType } from './splited-glyphs'
import type { AiModel, AiTtsModel } from '~/utils/ai/request'

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

interface HanziCheckPayload {
  userImage: string

  // image or word
  targetWord?: string
  targetImage?: string
}

interface TextToSpeechPayload {
  text: string
  model?: AiTtsModel
  voice?: 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer'
  response_format?: 'mp3' | 'opus' | 'aac' | 'flac'
  speed?: number
}

interface RawPayload {
  user?: string
  system?: string
  responseType: 'text' | 'json_object'
}

interface ImageToTextTranslatePayload {
  image: File
}

export type {
  HanziCheckPayload,
  ImageToTextTranslatePayload,
  LinguisticAnalysisFlatPayload,
  LinguisticAnalysisPayload,
  PinyinHieroglyphsPayload,
  RawPayload,
  SplitGlyphsPayload,
  TextToSpeechPayload,
}
