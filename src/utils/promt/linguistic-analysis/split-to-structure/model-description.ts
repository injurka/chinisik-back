const modelDescription = ` 
# Китайский лингвистический анализ (JSON структура)

**Иерархия элементов**:
1. Sentence → Word/Hieroglyph
2. Word → Hieroglyph
3. Hieroglyph → Key

**Поля**:

// Используется в различных моделях
- GrammarRules: {
  type: string, 
  description: string, 
  example?: string
}
- Pinyin: {
  value: string, 
  toneType: 1|2|3|4|5, 
  toneIndex: number
}
- PartOfSpeech: 'verb'|'noun'|'adjective'|'pronoun'|'particle'|'other'

- Sentence: {
  type: 'sentence',
  structure: {type: string, description: string},
  glyph: string,
  pinyin: Array<Pinyin>,
  translate: string,
  transcription: string,
  grammarRules: Array<GrammarRules>,
  hints: string[],
  components: Array<Word|Hieroglyph>
}

- Word: {
  type: 'word',
  glyph: string,
  pinyin: Array<Pinyin>,
  partOfSpeech: PartOfSpeech,
  translate: string,
  transcription: string,
  grammarRules: Array<GrammarRules>,
  hints: string[],
  hieroglyphs: Array<Hieroglyph|Word>
}

- Hieroglyph: {
  type: 'hieroglyph',
  glyph: string,
  pinyin: Array<Pinyin>,
  partOfSpeech: PartOfSpeech,
  translate: string,
  transcription: string,
  strokeCount: number,
  etymology: string,
  mnemonic: string,
  keys: Array<Key>,
  grammarRules: Array<GrammarRules>,
  hints: string[]
}

- KeyPosition: 'left'|'right'|'top'|'bottom'|'full-surround'|'top-surround'|'bottom-surround'|'left-surround'|'overlaid'|'center'|'inside'|'diagonal'|'top-left'|'top-right'|'bottom-left'|'bottom-right'|'cross'|'floating'
- KeyRole: 'semantic'|'phonetic'|'empty-sign'|'differentiator'|'structural'|'pictographic'|'compound-semantic'|'loan-component'|'semantic-phonetic'|'radical-variant'|'orthographic-marker'|'semantic-corrupt'|'component-fusion'|'pseudo-component'|'ornamental'

- Key: {
  glyph: string,
  position: KeyPosition,
  role: KeyRole,
  translate: string,
  keyInfo: {
    number: number, // Важно, чтобы это были индекс иероглифа и из набора 214 ключей словаря Канси.
    name: string,
    variants: string[],
    frequencyRank: number
  } | null,
  pinyin: Array<Pinyin>,
}

# Правила:
1. Только допустимые значения для enum-полей
2. Пример тона: 1 → первый тон ... 5 -> без тональности
3. keyInfo = null если компонент не из 214 ключей Канси
4. Примеры транскрипции: "да диан хуа"
5. Танскрипция и перевод должны быть только на русском языке"
`

export { modelDescription }
