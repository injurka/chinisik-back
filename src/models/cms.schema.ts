import { z } from '@hono/zod-openapi'
import { JsonToDomElementSchema } from '~/models/shared.schema'

const CmsDescriptionSchema = z.object({
  sysname: z.string(),
  value: JsonToDomElementSchema,
})

export {
  CmsDescriptionSchema,
}
