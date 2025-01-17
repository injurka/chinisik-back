import type { InputJsonObject } from '@prisma/client/runtime/library'
import type { PinyinHieroglyphsPayload, SplitGlyphsHieroglyph, SplitGlyphsPayload, SplitGlyphsSentence, SplitGlyphsWord } from '~/models/llvm'
import { HTTPException } from 'hono/http-exception'
import { PinyinHieroglyphsSchema, SplitedGlyphsSchema } from '~/models/llvm'
import { prisma } from '~/prisma'
import { logger } from '~/server'
import { createAiRequest } from '~/utils/deep-seek'
import { getPromt as getPinyinHieroglyphsPromt } from '~/utils/promt/pinyin-hieroglyphs'
import { getPromt as getSplitGlyphsPromt } from '~/utils/promt/split-glyphs'

class LlvmService {
  // SplitGlyphs
  splitGlyphs = async (params: SplitGlyphsPayload) => {
    // Not needed
    // const savedData = await prisma.splitGlyphsAll.findFirst({
    //   where: {
    //     glyph: params.glyphs,
    //   },
    // })
    // if (savedData)
    //   return savedData

    const { system, user } = getSplitGlyphsPromt(params)
    const response = await createAiRequest(system, user)
    const rawData = response.choices[0].message.content?.trim()

    try {
      if (!rawData)
        throw new Error('_', { cause: 'Failed to generate content.' })

      const formatedRawData = rawData.startsWith('{') ? `[${rawData}]` : rawData
      const parsedData = JSON.parse(formatedRawData)
      const validatedData = SplitedGlyphsSchema.parse(parsedData)

      // Not needed actually
      try {
        const existingRecord = await prisma.splitGlyphsAll.findFirst({
          where: {
            glyph: validatedData[0].glyph,
          },
        })

        if (existingRecord) {
          await prisma.splitGlyphsAll.update({
            where: {
              id: existingRecord.id,
            },
            data: {
              type: validatedData[0].type,
              data: validatedData,
            },
          })
        }
        else {
          await prisma.splitGlyphsAll.create({
            data: {
              glyph: validatedData[0].glyph,
              type: validatedData[0].type,
              data: validatedData,
            },
          })
        }

        const variants = ['hieroglyph', 'word', 'sentence']
        for (const variant of variants) {
          for (const item of parsedData) {
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
      }
      catch { }

      return validatedData
    }
    catch (err) {
      const errMsg = `Failed to format generated content. ${err}`
      logger.error(errMsg, rawData)
      throw new HTTPException(400, { message: errMsg })
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

  // PinyinHieroglyphs
  pinyinHieroglyphs = async (params: PinyinHieroglyphsPayload) => {
    const { system, user } = getPinyinHieroglyphsPromt(params)
    const response = await createAiRequest(system, user)
    const rawData = response.choices[0].message.content?.trim()

    try {
      if (!rawData)
        throw new Error('_', { cause: 'Failed to generate content.' })

      const parsedData = JSON.parse(rawData)
      const validatedData = PinyinHieroglyphsSchema.parse(parsedData)

      return validatedData
    }
    catch (err) {
      const errMsg = `Failed to format generated content. ${err}`
      logger.error(errMsg, rawData)
      throw new HTTPException(400, { message: errMsg })
    }
  }
}

export { LlvmService }
