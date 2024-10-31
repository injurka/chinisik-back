import KeysController from '~/api/controllers/keys.ts'
import { OpenAPIHono as Hono } from '@hono/zod-openapi'

const controllers = [
  {
    basePath: '/api/v1',
    controller: new KeysController(),
  },
]

export function setupRoutes(server: Hono) {
  controllers.forEach(({ basePath, controller: { router } }) => {
    server.route(basePath, router)
  })
}
