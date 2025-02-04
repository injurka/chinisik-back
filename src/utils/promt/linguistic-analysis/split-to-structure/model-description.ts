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
  value: string, // Плоский текст без тона
  toneType: 1|2|3|4|5, // Пример тона: 1 → первый тон ... 5 -> без тональности
  toneIndex: number
}
- PartOfSpeech: string // На русском языке

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
- Только допустимые значения для enum-полей
- Любые знаки должны быть исключены из поля "components" и не учитываются при разборе на состовляющие
- keyInfo = null если компонент не из 214 ключей Канси
- Танскрипция и перевод должны быть только на русском языке". Примеры транскрипции: "да диан хуа"
- Строгий JSON-синтаксис:
  * Все массивы должны быть правильно закрыты квадратными скобками []
  * Все объекты должны быть правильно закрыты фигурными скобками {}
  * После каждого элемента массива/объекта (кроме последнего) должна стоять запятая
  * Последний элемент массива/объекта НЕ должен иметь запятую
  * Все строковые значения должны быть в двойных кавычках с правильным экранированием
  * Вложенные структуры должны соблюдать правильную вложенность и закрытие скобок
}
`

export { modelDescription }
