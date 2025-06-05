import { z } from '@hono/zod-openapi'

const ChatCompletionContentPartTextSchema = z.object({
  type: z.literal('text'),
  text: z.string(),
})

const ChatCompletionContentPartImageSchema = z.object({
  type: z.literal('image_url'),
  image_url: z.object({
    url: z.string().url(), // Добавил .url() для валидации URL
    detail: z.enum(['auto', 'low', 'high']).optional(),
  }),
})

const ChatCompletionContentPartInputAudioSchema = z.object({
  type: z.literal('input_audio'),
  input_audio: z.object({
    data: z.string(), // Предполагаем, что это base64 строка
    format: z.enum(['wav', 'mp3']),
  }),
})

const ChatCompletionContentPartFileSchema = z.object({
  type: z.literal('file'),
  file: z.object({
    file_data: z.string().optional(), // base64
    file_id: z.string().optional(),
    filename: z.string().optional(),
  }).refine(data => data.file_data || data.file_id, { // Добавим refine, чтобы хотя бы одно было указано
    message: 'Either file_data or file_id must be provided for a file part.',
    path: ['file'], // Путь к ошибке
  }),
})

const ChatCompletionContentPartSchema = z.discriminatedUnion('type', [
  ChatCompletionContentPartTextSchema,
  ChatCompletionContentPartImageSchema,
  ChatCompletionContentPartInputAudioSchema,
  ChatCompletionContentPartFileSchema,
])

export { ChatCompletionContentPartSchema }
