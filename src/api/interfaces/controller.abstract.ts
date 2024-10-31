import { OpenAPIHono as Hono } from '@hono/zod-openapi'

abstract class AController {
  public router = new Hono();

  constructor(public path: string) {
    this.router.basePath(path)
  }
}

export default AController
