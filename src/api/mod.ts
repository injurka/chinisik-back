import type { OpenAPIHono as Hono } from '@hono/zod-openapi'

import {
  AuthController,
  CmsController,
  HieroglyphKeyController,
  LinguisticAnalysisController,
  LlvmController,
  PinyinController,
  UserController,
} from './controllers'

const COMBINE_V1 = {
  BASE_PATH: '/api/v1',
  CONTROLLERS: [
    new AuthController(),
    new UserController(),
    new HieroglyphKeyController(),
    new LlvmController(),
    new CmsController(),
    new PinyinController(),
    new LinguisticAnalysisController(),
  ],
}

export function setupRoutes(server: Hono) {
  COMBINE_V1.CONTROLLERS.forEach((controller) => {
    server.route(COMBINE_V1.BASE_PATH, controller.router)
  })
}
