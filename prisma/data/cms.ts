export function mockCms() {
  return [{
    sysname: 'keys',
    value: {
      tag: 'div',
      class: 'description',
      children: [
        {
          tag: 'h2',
          children: '214-ть радикалов, чтобы управлять всеми иероглифами',
        },
        {
          tag: 'p',
          children: 'Знание 214-ти радикалов облегчит вам процесс изучения китайского языка. Почему?',
        },
        {
          tag: 'p',
          children: 'Потому что, когда вы знаете радикалы, вам легче запомнить, как они сочетаются друг с другом, образуя более сложные символы.',
        },
        {
          tag: 'p',
          children: 'Радикалы могут выполнять одну из следующих функций или обе:',
        },
        {
          tag: 'ul',
          children: [
            {
              tag: 'li',
              children: [
                {
                  tag: 'em',
                  children: 'семантический',
                },
                {
                  tag: 'span',
                  children: ', предоставление части или всего смысла;',
                },
              ],
            },
            {
              tag: 'li',
              children: [
                {
                  tag: 'em',
                  children: 'фонетика',
                },
                {
                  tag: 'span',
                  children: ', придание звука персонажу или чему-то очень близкому к нему.',
                },
              ],
            },
          ],
        },
        {
          tag: 'p',
          children: [
            {
              tag: 'span',
              children: 'По-китайски ключи именуются ',
            },
            {
              tag: 'HieroglyphWord',
              props: {
                glyph: '部首',
                pinyin: {
                  pinyin: 'bushou',
                  tone: [{
                    index: 1,
                    type: 1,
                  }, {
                    index: 4,
                    type: 3,
                  }],
                },
                variant: 2,
              },
            },
            {
              tag: 'span',
              children: ' дословно “голова раздела”.',
            },
          ],
        },
        {
          tag: 'span',
          children: 'Также китайские ключи часто называют “радикалами” (от английского radicals). ',
        },
        {
          tag: 'p',
          children: [{
            tag: 'span',
            children: 'На протяжении истории количество иероглифов в таблицах ключей варьировалось. Наиболее широкое распространение получила система из словаря Канси ',
          }, {
            tag: 'HieroglyphWord',
            props: {
              glyph: '康熙字典',
              pinyin: {
                pinyin: 'kangxi zidian',
                tone: [{
                  index: 1,
                  type: 1,
                }, {
                  index: 5,
                  type: 1,
                }, {
                  index: 8,
                  type: 4,
                }, {
                  index: 11,
                  type: 3,
                }],
              },
              variant: 2,
              translate: 'Словарь канси',
            },
          }, {
            tag: 'span',
            children: ' , насчитывающая 214 иероглифических ключей.',
          }],
        },
      ],
    },
  }, {
    sysname: 'pinyin',
    value: {
      tag: 'div',
      class: 'description',
      children: [
        {
          tag: 'h2',
          children: 'Китайские тоны и их обозначения',
        },
        {
          tag: 'p',
          children: 'Каждый китайский иероглиф представляет собой отдельный слог, который может быть произнесен в одной из пяти тональностей. Именно тоны китайского языка представляют наибольшую трудность для изучения, поскольку аналогов на родном языке обычно нет. Тем не менее, после определенной, иногда короткой, практики, в зависимости от слуха ученика, наступает момент, когда тона начинают различаться на слух. Для написания китайских слогов с учетом тонов существует система пиньинь, основанная на латинском алфавите.',
        },
        {
          tag: 'ul',
          children: [
            {
              tag: 'li',
              children: [
                {
                  tag: 'b',
                  children: 'Первый тон',
                },
                {
                  tag: 'span',
                  children: ' - произносится высоко и ровно, как писк азбуки Морзе.  Обозначается прямой линией над буквой ',
                },
                {
                  tag: 'PinyinText',
                  props: {
                    pinyin: 'ma',
                    tone: [{
                      index: 1,
                      type: 1,
                    }],
                  },
                },
                {
                  tag: 'span',
                  children: ' или просто ma1.',
                },
              ],
            },
            {
              tag: 'li',
              children: [
                {
                  tag: 'b',
                  children: 'Второй тон',
                },
                {
                  tag: 'span',
                  children: ' - переход от среднего к высокому звучит как странный вопрос.  Обозначается ',
                },
                {
                  tag: 'PinyinText',
                  props: {
                    pinyin: 'ma',
                    tone: [{
                      index: 1,
                      type: 2,
                    }],
                  },
                },
                {
                  tag: 'span',
                  children: ' или просто ma2.',
                },
              ],
            },
            {
              tag: 'li',
              children: [
                {
                  tag: 'b',
                  children: 'Третий тон',
                },
                {
                  tag: 'span',
                  children: ' - низкое падение, а затем подъем до среднего уровня.  Тон больше похож на русское междометие \'Ну!?\'.  Обозначается ',
                },
                {
                  tag: 'PinyinText',
                  props: {
                    pinyin: 'ma',
                    tone: [{
                      index: 1,
                      type: 3,
                    }],
                  },
                },
                {
                  tag: 'span',
                  children: ' или просто ma3.',
                },
              ],
            },
            {
              tag: 'li',
              children: [
                {
                  tag: 'b',
                  children: 'Четвёртый тон',
                },
                {
                  tag: 'span',
                  children: ' - падение с высоты на низ, звучит как своего рода утверждение. Обозначается ',
                },
                {
                  tag: 'PinyinText',
                  props: {
                    pinyin: 'ma',
                    tone: [{
                      index: 1,
                      type: 4,
                    }],
                  },
                },
                {
                  tag: 'span',
                  children: ' или просто ma4.',
                },
              ],
            },
            {
              tag: 'li',
              children: [
                {
                  tag: 'b',
                  children: 'Слог без тона',
                },
                {
                  tag: 'span',
                  children: ' - никак не обозначается и произносится без тональности ',
                },
                {
                  tag: 'PinyinText',
                  props: {
                    pinyin: 'ma',
                    tone: [{
                      index: 1,
                      type: 0,
                    }],
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  }]
}
