import Server from '~/server.ts'

if (import.meta.main) {
  const app = Server.getServer()

  Deno.serve(app.fetch)
}
