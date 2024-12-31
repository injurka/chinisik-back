const modelDescription = `
# Common fields for all element types:

1. type:
- Description: The type of the element.Can be "sentence", "hieroglyph", or "word".
   - Example: "sentence", "hieroglyph", "word".

2. glyph:
- Description: Textual representation of the element in Chinese.
   - Example: "打电话", "打", "电话".

3. pinyin:
- Description: Pinyin transcription of the element.Can be a string or an array of objects if the element consists of multiple characters.
   - Example:
- For "hieroglyph": "da"
  - For "word":
\`\`\`json
[
  {
    "value": "dian",
    "toneType": 4,
    "toneIndex": 2
  },
  {
    "value": "hua",
    "toneType": 4,
    "toneIndex": 2
  }
]
\`\`\`

4. toneType:
   - Description: The type of tone in Pinyin. Usually a number from 1 to 5, where 5 represents a neutral tone.
   - Example: 3, 4.

5. toneIndex:
   - Description: The index of the tone in Pinyin. Indicates the position of the tone in the word.
   - Example: 1, 2.

6. translate:
   - Description: Translation of the element into another language (in this case, Russian). Can be a string or an array of objects if the element has multiple meanings.
   - Example: 
     - For "sentence": "позвонить по телефону"
     - For "hieroglyph": 
\`\`\`json
[
  {
    "pos": "verb",
    "value": "звонить",
    "freq": 0.8
  },
  {
    "pos": "verb",
    "value": "бить",
    "freq": 0.5
  }
]
\`\`\`

7. transcription:
   - Description: Transcription of the element into Latin script (because we are working in the context of a Russian translation) usually based on Pinyin.
   - Example: "да диан хуа", "да", "диан хуа".

8. components:
   - Description: The constituent parts of the element if it consists of multiple hieroglyphs.

# Additional fields for specific element types:

- For "sentence":
  - pinyin: An array of objects, each containing the Pinyin value, tone type, and tone index.
  - components: An array of hieroglyphs that make up the sentence.

- For "word":
  - pinyin: An array of objects, each containing the Pinyin value, tone type, and tone index.
  - components: An array of hieroglyphs that make up the word.

- For "hieroglyph":
  - pinyin: A string representing the Pinyin of the hieroglyph.
  - toneType: The tone type of the hieroglyph.
  - toneIndex: The tone index of the hieroglyph.
  - translate: An array of objects, each containing the part of speech (\`pos\`), the translation value (\`value\`), and the frequency of use (\`freq\`).
  - components: An array of hieroglyphs that make up this hieroglyph (if it is compound). It is important that these should be hieroglyphs from the set of 214 keys of the Kan xi dictionary.

# Filling extra conditions

If the type is a \`sentence\`, then its components must have elements with type: \`word\` in the final json.
If the type is a \`word\`, then its components must have elements with type: \`hieroglyph\` in the final json.
`

export { modelDescription }
