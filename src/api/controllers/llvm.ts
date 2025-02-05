import { createRoute, z } from '@hono/zod-openapi'
import AController from '~/api/interfaces/controller.abstract'
import { jwtGuard } from '~/middleware'
import { LlvmLinguisticAnalysisSchema, ToneTypeSchema } from '~/models'
import { PinyinHieroglyphsSchema } from '~/models/llvm/pinyin-hieroglyphs.schema'
import { SplitedGlyphsSchema } from '~/models/llvm/splited-glyphs.schema'
import { LlvmService } from '~/services'
import { AI_MODELS } from '~/utils/ai'
import { validPinyinSyllables } from '~/utils/constant'

const TAG = 'llvm'

class LlvmController extends AController {
  private service = new LlvmService()

  constructor() {
    super('/llvm')

    this.splitGlyphs()
    this.pinyinHieroglyphs()
    this.linguisticAnalysis()
  }

  private splitGlyphs = () => {
    const BodySchema = z.object({
      type: z.enum(['sentence', 'word', 'hieroglyph']).default('word'),
      glyphs: z.string(),
    })

    const route = createRoute({
      method: 'post',
      path: `${this.path}/split-glyphs`,
      tags: [TAG],
      request: {
        body: {
          content: {
            'application/json': {
              schema: BodySchema,
            },
          },
        },
        // TODO
        // headers: z.object({ 'authorization': z.string() }),
      },
      responses: {
        200: {
          content: {
            'application/json': {
              schema: SplitedGlyphsSchema,
            },
          },
          description: 'Split glyphs',
        },
      },
    })

    // TODO
    // this.router.use(route.path, jwtGuard)
    this.router.openapi(
      route,
      async (c) => {
        const body = c.req.valid('json')
        const data = await this.service.splitGlyphs(body)

        return c.json(SplitedGlyphsSchema.parse(data), 200)
      },
    )
  }

  private linguisticAnalysis = () => {
    const BodySchema = z.object({
      value: z.string().max(50).default('打电话'),
      model: z.enum(AI_MODELS).default('google/gemini-flash-1.5'),
    })

    const route = createRoute({
      method: 'post',
      path: `${this.path}/linguistic-analysis`,
      tags: [TAG],
      request: {
        body: {
          content: {
            'application/json': {
              schema: BodySchema,
            },
          },
        },
        headers: z.object({ 'x-authorization': z.string() }),
      },
      responses: {
        200: {
          content: {
            'application/json': {
              schema: LlvmLinguisticAnalysisSchema,
            },
          },
          description: `
Анализатор китайского языка, преобразующий текст в подробную структуру данных.
          `,
        },
      },
    })

    this.router.use(route.path, jwtGuard)
    this.router.openapi(
      route,
      async (c) => {
        const body = c.req.valid('json')
        const user = c.get('user')

        const data = await this.service.linguisticAnalysis(body, user)

        return c.json(data, 200)
      },
    )
  }

  private pinyinHieroglyphs = () => {
    const BodySchema = z.object({
      tones: ToneTypeSchema.array()
        .optional()
        .default([1, 2, 3, 4]),
      pinyin: z.string()
        .default('ni')
        .refine(val => validPinyinSyllables.includes(val), { message: 'Invalid pinyin syllable' }),
      count: z.number()
        .optional()
        .default(2),
    })

    const route = createRoute({
      method: 'post',
      path: `${this.path}/pinyin-hieroglyphs`,
      tags: [TAG],
      request: {
        body: {
          content: {
            'application/json': {
              schema: BodySchema,
            },
          },
        },
        // TODO
        // headers: z.object({ 'x-authorization': z.string() }),
      },
      responses: {
        200: {
          content: {
            'application/json': {
              schema: PinyinHieroglyphsSchema,
            },
          },
          description: 'Generate pinyin tone hieroglyphs',
        },
      },
    })

    // TODO
    // this.router.use(route.path, jwtGuard)
    this.router.openapi(
      route,
      async (c) => {
        const body = c.req.valid('json')
        const data = await this.service.pinyinHieroglyphs(body)

        return c.json(PinyinHieroglyphsSchema.parse(data), 200)
      },
    )
  }
}

export { LlvmController }
