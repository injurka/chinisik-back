import type { SplitGlyphsPayload } from '~/models/llvm'

import type { SplitGlyphsType } from '~/models/splited-glyphs'

import hieroglyphJSON from './jsons/hieroglyph.json'
import sentenceJSON from './jsons/sentence.json'
import wordJSON from './jsons/word.json'
import { modelDescription } from './model-description'

const splitGlyphsType: Record<SplitGlyphsType, unknown> = {
  hieroglyph: hieroglyphJSON,
  sentence: sentenceJSON,
  word: wordJSON,
}

function getPromt(params: SplitGlyphsPayload) {
  const example = splitGlyphsType[params.type]

  const system = `
  The user will provide some hieroglyphs. Split the following set of hieroglyphs into its components:


  EXAMPLE INPUT:
  ${(example as { glyph: string }).glyph}

  EXAMPLE JSON OUTPUT:
  \`\`\`json
  ${JSON.stringify(example)}
  \`\`\`

  DATA MODEL DESCRIPTION:
  ${modelDescription}

  Minify result JSON. The output must also be an array of objects.
  `

  const user = `
  ${params.glyphs}
  `

  return { system, user }
}

export {
  getPromt,
  splitGlyphsType,
}
