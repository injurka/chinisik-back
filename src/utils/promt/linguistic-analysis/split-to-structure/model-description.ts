const modelDescription = ` 
# Китайский лингвистический анализ (JSON структура)

**Иерархия элементов**:
1. Sentence → Word/Hieroglyph (В предложении могут как просто слова, так и простые иероглифы которые нельзя отнести к слову)
2. Word → Hieroglyph (Слово всегда разделяется на иероглифы, предложение должно разбиваться на компоненты так, чтобы слова могли быть разбиты на иероглифы)
3. Hieroglyph → Key (У всех иероглифов есть ключи из которых они состоят)

**Поля**:

// Используется в различных моделях
- GrammarRules: {
  type: string,
  description: string,
  example?: string
}
- Pinyin: {
  value: string, // Плоский текст без тона
  toneType: 1|2|3|4|5, // Пример тона: 1 → первый тон ... 5 -> без тона. По умолчанию значение - 5
  toneIndex: number // По умолчанию значение - 0
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

# Текущая схема валидации '@hono/zod-openapi'

const GrammarRulesSchema = z.object({
  type: z.string(),
  description: z.string(),
  example: z.string().optional(),
})
const PinyinSchema = z.object({
  value: z.string(),
  toneType: z.number().int().min(1).max(5).default(5),
  toneIndex: z.number().int().default(0),
})
const PartOfSpeechSchema = z.string()

const KeyPositionSchema = z.enum([
  'left',
  'right',
  'top',
  'bottom',
  'full-surround',
  'top-surround',
  'bottom-surround',
  'left-surround',
  'overlaid',
  'center',
  'inside',
  'diagonal',
  'top-left',
  'top-right',
  'bottom-left',
  'bottom-right',
  'cross',
  'floating',
])
const KeyRoleSchema = z.enum([
  'semantic',
  'phonetic',
  'empty-sign',
  'differentiator',
  'structural',
  'pictographic',
  'compound-semantic',
  'loan-component',
  'semantic-phonetic',
  'radical-variant',
  'orthographic-marker',
  'semantic-corrupt',
  'component-fusion',
  'pseudo-component',
  'ornamental',
])

const KeySchema = z.object({
  glyph: z.string(),
  position: KeyPositionSchema,
  role: KeyRoleSchema,
  translate: z.string(),
  pinyin: z.array(PinyinSchema),
  keyInfo: z.object({
    number: z.number(),
    name: z.string(),
    variants: z.array(z.string()),
    frequencyRank: z.number(),
  }).nullable().optional().nullable(),
})

const HieroglyphSchema = z.object({
  type: z.literal('hieroglyph'),
  glyph: z.string(),
  pinyin: z.array(PinyinSchema),
  partOfSpeech: PartOfSpeechSchema,
  translate: z.string(),
  transcription: z.string(),
  strokeCount: z.number().default(0),
  etymology: z.string().default(''),
  mnemonic: z.string().default(''),
  keys: z.array(KeySchema).optional(),
  grammarRules: z.array(GrammarRulesSchema).optional(),
  hints: z.array(z.string()).optional(),
})

const WordSchema = z.object({
  type: z.literal('word'),
  glyph: z.string(),
  pinyin: z.array(PinyinSchema),
  partOfSpeech: PartOfSpeechSchema,
  translate: z.string(),
  transcription: z.string(),
  grammarRules: z.array(GrammarRulesSchema).optional(),
  hints: z.array(z.string()).optional(),
  hieroglyphs: z.array(HieroglyphSchema).optional(),
})

const SentenceSchema = z.object({
  type: z.literal('sentence'),
  structure: z.object({
    type: z.string(),
    description: z.string(),
  }),
  glyph: z.string(),
  pinyin: z.array(PinyinSchema),
  translate: z.string(),
  transcription: z.string(),
  grammarRules: z.array(GrammarRulesSchema).optional(),
  hints: z.array(z.string()).optional(),
  components: z.array(z.union([HieroglyphSchema, WordSchema])).optional(),
})

const LinguisticAnalysisSchema = z.object({
  sentences: z.array(SentenceSchema),
})

const LinguisticAnalysisSourceTypeSchema = z.object({
  type: z.enum(['sentence', 'word']),
  cn: z.string(),
})
`

export { modelDescription }
