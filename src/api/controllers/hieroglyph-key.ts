import type { Context } from 'hono'
import { createRoute, z } from '@hono/zod-openapi'
import AController from '~/api/interfaces/controller.abstract'
import { HieroglyphKeyDescriptionSchema, HieroglyphKeySchema } from '~/models/hieroglyph-key.schema'
import HieroglyphKeyService from '~/services/hieroglyph-key'

class HieroglyphKeyController extends AController {
  private service = new HieroglyphKeyService()

  constructor() {
    super('/keys')

    this.getKeys()
    this.getDescription()
  }

  private getKeys = () => {
    const route = createRoute({
      method: 'get',
      path: `${this.path}`,
      tags: ['keys'],
      responses: {
        200: {
          content: {
            'application/json': {
              schema: z.array(HieroglyphKeySchema),
            },
          },
          description: 'Retrieve the keys',
        },
      },
    })

    this.router.openapi(
      route,
      async (c) => {
        const data = await this.service.getKeys()
        const validatedData = z.array(HieroglyphKeySchema).parse(data)

        return c.json(validatedData, 200)
      },
    )
  }

  private getDescription = () => {
    const route = createRoute({
      method: 'get',
      path: `${this.path}/description`,
      tags: ['keys'],
      responses: {
        200: {
          content: {
            'application/json': {
              schema: HieroglyphKeyDescriptionSchema,
            },
          },
          description: 'Retrieve the desription for keys',
        },
      },
    })

    this.router.openapi(
      route,
      async (c: Context) => {
        const data = await this.service.getDescription()
        const validatedData = HieroglyphKeyDescriptionSchema.parse(data)

        return c.json(validatedData, 200)
      },
    )
  }
}

export default HieroglyphKeyController
