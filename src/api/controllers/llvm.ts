import { createRoute, z } from '@hono/zod-openapi'
import AController from '~/api/interfaces/controller.abstract'
import type { SplitGlyphsPayload } from '~/models/llvm'
import { LlvmService } from '~/services'

class LlvmController extends AController {
  private service = new LlvmService()

  constructor() {
    super('/llvm')

    this.splitGlyphs()
  }

  private splitGlyphs = () => {
    const QuerySchema = z.object({
      type: z.enum(['sentence', 'word', 'hieroglyph']).default('word'),
      word: z.string(),
    })

    const route = createRoute({
      method: 'get',
      path: `${this.path}/split-glyphs`,
      tags: ['llvm'],
      request: {
        query: QuerySchema,
      },
      responses: {
        200: {
          content: {
            'application/json': {
              schema: z.any(),
              // TODO SpliteGlyphsSchema,
            },
          },
          description: 'Split glyphs',
        },
      },
    })

    this.router.openapi(
      route,
      async (c) => {
        const params = QuerySchema.parse(c.req.query()) satisfies SplitGlyphsPayload

        const data = await this.service.splitGlyphs(params)

        return c.json(z.any().parse(data), 200)
      },
    )
  }
}

export { LlvmController }
