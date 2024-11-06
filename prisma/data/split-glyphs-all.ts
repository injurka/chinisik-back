function mockSplitGlyphsAll() {
  return [{
    glyph: '如果',
    type: 'word',
    data: [
      {
        type: 'word',
        glyph: '如果',
        pinyin: [
          {
            value: 'rú',
            toneType: 2,
            toneIndex: 0,
          },
          {
            value: 'guǒ',
            toneType: 3,
            toneIndex: 0,
          },
        ],
        translate: 'если',
        transcription: 'ру го',
        components: ['如', '果'],
      },
      {
        type: 'hieroglyph',
        glyph: '如',
        pinyin: 'rú',
        toneType: 2,
        toneIndex: 0,
        translate: [
          {
            pos: 'conjunction',
            value: 'как',
            freq: 1,
          },
        ],
        transcription: 'ру',
        components: ['女', '口'],
      },
      {
        type: 'hieroglyph',
        glyph: '果',
        pinyin: 'guǒ',
        toneType: 3,
        toneIndex: 0,
        translate: [
          {
            pos: 'noun',
            value: 'фрукт',
            freq: 1,
          },
        ],
        transcription: 'го',
        components: ['田', '木'],
      },
    ],
  }]
}

export { mockSplitGlyphsAll }
