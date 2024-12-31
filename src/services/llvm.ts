import type { InputJsonObject } from '@prisma/client/runtime/library'
import type { SplitGlyphsPayload } from '~/models/llvm'
import type { SplitGlyphsHieroglyph, SplitGlyphsSentence, SplitGlyphsWord } from '~/models/splited-glyphs'
import { HTTPException } from 'hono/http-exception'
import { SplitedGlyphsSchema } from '~/models/splited-glyphs.schema'
import { prisma } from '~/prisma'
import { createAiRequest } from '~/utils/deep-seek'
import { getPromt } from '~/utils/promt'

class LlvmService {
  splitGlyphs = async (params: SplitGlyphsPayload) => {
    const savedData = await prisma.splitGlyphsAll.findFirst({
      where: {
        glyph: params.glyphs,
      },
    })

    if (savedData)
      return savedData

    const { system, user } = getPromt(params)
    const response = await createAiRequest(system, user)
    const rawData = response.choices[0].message.content

    try {
      if (!rawData)
        throw new Error('Failed to generate content.')

      let data = JSON.parse(rawData)
      if (!Array.isArray(data))
        data = [data]

      const validatedData = SplitedGlyphsSchema.parse(data)

      await prisma.splitGlyphsAll.create({
        data: {
          glyph: validatedData[0].glyph,
          type: validatedData[0].type,
          data: validatedData,
        },
      })

      const variants = ['hieroglyph', 'word', 'sentence']

      for (const variant of variants) {
        for (const item of data) {
          if (item.type !== variant) {
            continue
          }

          switch (variant) {
            case 'sentence':
              await this.saveSentence(item)
              break
            case 'hieroglyph':
              await this.saveHieroglyph(item)
              break
            case 'word':
              await this.saveWord(item)
              break
          }
        }
      }

      return validatedData
    }
    catch {
      throw new HTTPException(400, { message: 'Failed to generate content.' })
    }
  }

  saveSentence = async (sentence: SplitGlyphsSentence) => {
    const { glyph, translate, transcription, pinyin, components } = sentence

    const pinyinJson = pinyin.map(p => ({
      value: p.value,
      toneType: p.toneType,
      toneIndex: p.toneIndex,
    }))

    const existingSentence = await prisma.splitGlyphsSentence.findUnique({
      where: { glyph },
    })

    if (existingSentence) {
      await prisma.splitGlyphsSentence.update({
        where: { id: existingSentence.id },
        data: {
          translate,
          transcription,
          pinyin: pinyinJson,
        },
      })
    }
    else {
      const newSentence = await prisma.splitGlyphsSentence.create({
        data: {
          glyph,
          translate,
          transcription,
          pinyin: pinyinJson,
        },
      })

      for (const [index, component] of components.entries()) {
        const word = await prisma.splitGlyphsWord.findUnique({
          where: { glyph: component },
        })

        if (word) {
          await prisma.splitGlyphsSentenceWords.create({
            data: {
              order: index,
              sentenceId: newSentence.id,
              wordId: word.id,
            },
          })
        }
      }
    }
  }

  saveWord = async (word: SplitGlyphsWord) => {
    const { glyph, translate, transcription, pinyin, components } = word

    const pinyinJson = pinyin.map(p => ({
      value: p.value,
      toneType: p.toneType,
      toneIndex: p.toneIndex,
    }))

    const existingWord = await prisma.splitGlyphsWord.findUnique({
      where: { glyph },
    })

    if (existingWord) {
      await prisma.splitGlyphsWord.update({
        where: { id: existingWord.id },
        data: {
          translate,
          transcription,
          pinyin: pinyinJson,
        },
      })
    }
    else {
      const newWord = await prisma.splitGlyphsWord.create({
        data: {
          glyph,
          translate,
          transcription,
          pinyin: pinyinJson,
        },
      })

      for (const [index, component] of components.entries()) {
        const hieroglyph = await prisma.splitGlyphsHieroglyph.findUnique({
          where: { glyph: component },
        })

        if (hieroglyph) {
          await prisma.splitGlyphsWordHieroglyphs.create({
            data: {
              order: index,
              wordId: newWord.id,
              hieroglyphId: hieroglyph.id,
            },
          })
        }
      }
    }
  }

  saveHieroglyph = async (hieroglyph: SplitGlyphsHieroglyph) => {
    const {
      glyph,
      pinyin,
      toneType,
      toneIndex,
      translate,
      transcription,
      components,
    } = hieroglyph

    const existingHieroglyph = await prisma.splitGlyphsHieroglyph.findUnique({
      where: { glyph },
    })

    if (existingHieroglyph) {
      await prisma.splitGlyphsHieroglyph.update({
        where: {
          id: existingHieroglyph.id,
        },
        data: {
          pinyin,
          toneType,
          toneIndex,
          transcription,
          translate: translate as unknown as InputJsonObject,
        },
      })
    }
    else {
      const newHieroglyph = await prisma.splitGlyphsHieroglyph.create({
        data: {
          glyph,
          pinyin,
          toneType,
          toneIndex,
          transcription,
          translate: translate as unknown as InputJsonObject,
        },
      })

      for (const [index, component] of components.entries()) {
        const key = await prisma.splitGlyphsHieroglyph.findUnique({
          where: { glyph: component },
        })

        if (key) {
          await prisma.splitGlyphsHieroglyphKeys.create({
            data: {
              order: index,
              hieroglyphId: newHieroglyph.id,
              keyId: key.id,
            },
          })
        }
      }
    }
  }
}

export { LlvmService }
