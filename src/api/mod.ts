import type { OpenAPIHono as Hono } from '@hono/zod-openapi'

import {
  AuthController,
  CmsController,
  HieroglyphKeyController,
  LlvmController,
  PinyinController,
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
  {
    basePath: '/api/v1',
    controller: new LlvmController(),
  },
  {
    basePath: '/api/v1',
    controller: new CmsController(),
  },
  {
    basePath: '/api/v1',
    controller: new PinyinController(),
  },
]

export function setupRoutes(server: Hono) {
  controllers.forEach(({ basePath, controller: { router } }) => {
    server.route(basePath, router)
  })
}
