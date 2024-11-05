import { createRoute } from '@hono/zod-openapi'
import AController from '~/api/interfaces/controller.abstract'

import { CmsDescriptionSchema } from '~/models/cms.schema'
import { CmsService } from '~/services'

class CmsController extends AController {
  private service = new CmsService()

  constructor() {
    super('/cms')

    this.getContent()
  }

  private getContent = () => {
    const route = createRoute({
      method: 'get',
      path: `${this.path}/description`,
      tags: ['cms'],
      responses: {
        200: {
          content: {
            'application/json': {
              schema: CmsDescriptionSchema,
            },
          },
          description: 'Retrieve the desription for keys',
        },
      },
    })

    this.router.openapi(
      route,
      async (c) => {
        const data = await this.service.getContent()
        const validatedData = CmsDescriptionSchema.parse(data)

        return c.json(validatedData, 200)
      },
    )
  }
}

export { CmsController }
