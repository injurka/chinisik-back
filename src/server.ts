import { prettyJSON } from '@hono/hono/pretty-json'
import { cors } from '@hono/hono/cors'
import { Context } from "@hono/hono";
import { register } from "prom-client";
import { OpenAPIHono as Hono } from '@hono/zod-openapi'
import { serveStatic } from '@hono/hono/deno'
import { prometheusMiddleware } from '~/middleware/prometheus.ts';
import { setupRoutes } from '~/api/mod.ts';
import setupSwagger from '~/swagger.ts';

class Server {
  private server: Hono

  constructor() {
    this.server = new Hono()

    this.initializeMiddlewares()
    this.initializeRestControllers()
    this.initializeStaticFileRoutes()
  }

  public getServer() {
    return this.server
  }

  private initializeMiddlewares() {
    try {
      this.server.use(prettyJSON())
      this.server.use(cors())
      this.server.use(prometheusMiddleware)
      this.server.defaultHook = (result, c) => {
        if (!result.success) {
          return c.json(
            {
              ok: false,
              errors: result,
              source: 'custom_error_handler',
            },
            422
          )
        }
      }

      console.log('Middlewares')
    }
    catch (e) {
      console.log('Middlewares', e)
    }
  }

  private initializeRestControllers() {
    try {
      this.server.get("/metrics", async (c: Context): Promise<Response> => {
        c.set("Content-Type", "text/plain; version=0.0.4");
        return c.text(await register.metrics(), 200);
      });
      this.server.get("/healthz", (c: Context): Response => c.text('healthy', 200));

      setupSwagger(this.server)
      setupRoutes(this.server)

      console.log('Controllers')
    }
    catch (e) {
      console.log('Controllers', e)
    }
  }

  private initializeStaticFileRoutes() {
    try {
      this.server.use(
        '*',
        serveStatic({
          root: './static',
          precompressed: true,
          onFound: (_path, c) => {
            c.header('Cache-Control', `public, immutable, max-age=31536000`)
          },
          onNotFound: (path, c) => {
            console.log(`${path} is not found, you access ${c.req.path}`)
          }
        })
      )

      console.log('StaticFileRoutes')
    }
    catch (e) {
      console.log('StaticFileRoutes', e)
    }
  }
}

const server = new Server()

export default server
