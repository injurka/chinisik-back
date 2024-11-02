import type { Context } from 'hono'
import { createRoute, z } from '@hono/zod-openapi'
import AController from '~/api/interfaces/controller.abstract'
import { HieroglyphKeyDescriptionSchema, HieroglyphKeySchema } from '~/models/keys.schema'
import KeysService from '~/services/keys'

class KeysController extends AController {
  private service = new KeysService()

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

    const handler = async (c: Context) => {
      const data = await this.service.getKeys()
      const validatedData = z.array(HieroglyphKeySchema).parse(data)

      return c.json(validatedData, 200)
    }

    this.router.openapi(route, handler)
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

    const handler = async (c: Context) => {
      const data = await this.service.getDescription()
      const validatedData = HieroglyphKeyDescriptionSchema.parse(data)

      return c.json(validatedData, 200)
    }

    this.router.openapi(route, handler)
  }
}

export default KeysController
