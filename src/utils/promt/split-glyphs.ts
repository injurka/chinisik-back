import type { SplitGlyphsPayload, SplitGlyphsType } from '~/models/llvm'

import hieroglyph from './jsons/hieroglyph.json'
import sentence from './jsons/sentence.json'
import word from './jsons/word.json'

const splitGlyphsType: Record<SplitGlyphsType, unknown> = {
  hieroglyph,
  sentence,
  word,
}

function getPromt(params: SplitGlyphsPayload) {
  const example = splitGlyphsType[params.type]

  const text = `
  Разбей слово ${params.word} по следующему примеру:
  \`\`\`json
  ${JSON.stringify(example)}
  \`\`\`
  Ответ выведи в формате JSON
  `

  return text
}

export {
  getPromt,
  splitGlyphsType,
}
