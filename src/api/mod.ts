import type { OpenAPIHono as Hono } from '@hono/zod-openapi'

import {
  AuthController,
  HieroglyphKeyController,
  UserController,
} from './controllers'

const controllers = [
  {
    basePath: '/api/v1',
    controller: new AuthController(),
  },
  {
    basePath: '/api/v1',
    controller: new UserController(),
  },
  {
    basePath: '/api/v1',
    controller: new HieroglyphKeyController(),
  },
]

export function setupRoutes(server: Hono) {
  controllers.forEach(({ basePath, controller: { router } }) => {
    server.route(basePath, router)
  })
}
