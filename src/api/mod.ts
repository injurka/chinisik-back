import type { OpenAPIHono as Hono } from '@hono/zod-openapi'
import HieroglyphKeyController from '~/api/controllers/hieroglyph-key'
import UserController from './controllers/user'

const controllers = [
  {
    basePath: '/api/v1',
    controller: new HieroglyphKeyController(),
  },
  {
    basePath: '/api/v1',
    controller: new UserController(),
  },
]

export function setupRoutes(server: Hono) {
  controllers.forEach(({ basePath, controller: { router } }) => {
    server.route(basePath, router)
  })
}
