import type { SplitGlyphsPayload } from '~/models/llvm'
import { createRoute, z } from '@hono/zod-openapi'
import AController from '~/api/interfaces/controller.abstract'
import { SplitedGlyphsSchema } from '~/models/splited-glyphs.schema'
import { LlvmService } from '~/services'
// import { jwtGuard } from '~/middleware'

class LlvmController extends AController {
  private service = new LlvmService()

  constructor() {
    super('/llvm')

    this.splitGlyphs()
  }

  private splitGlyphs = () => {
    const QuerySchema = z.object({
      type: z.enum(['sentence', 'word', 'hieroglyph']).default('word'),
      glyphs: z.string(),
    })

    const route = createRoute({
      method: 'get',
      path: `${this.path}/split-glyphs`,
      tags: ['llvm'],
      request: {
        query: QuerySchema,
        // headers: z.object({ 'x-authorization': z.string() }),
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

    // TODO later
    // this.router.use(route.path, jwtGuard)
    this.router.openapi(
      route,
      async (c) => {
        const params = QuerySchema.parse(c.req.query()) satisfies SplitGlyphsPayload
        const data = await this.service.splitGlyphs(params)

        return c.json(SplitedGlyphsSchema.parse(data), 200)
      },
    )
  }
}

export { LlvmController }
