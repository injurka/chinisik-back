import OpenAI from 'openai'

const AI_HUBMIX_MODELS = [
  'gemini-2.0-flash-lite',
  'gemini-2.0-flash',
  'gemini-2.0-flash-search',
  'gemini-2.0-pro-exp-02-05',
  'gemini-2.0-pro-exp-02-05-search',
  'gemini-2.5-pro-exp-03-25',
  'Doubao-1.5-lite-32k',
  'gpt-4o-mini',
  'Doubao-1.5-pro-32k',
  'Doubao-1.5-pro-256k',
] as const
const AI_OPENROUTER_MODELS = [
  'google/gemini-2.0-flash-001',
  'google/gemini-2.0-flash-lite-001',
] as const

const AI_MODELS = [...AI_HUBMIX_MODELS, ...AI_OPENROUTER_MODELS] as const

type AiModel = typeof AI_MODELS[number]

interface AiRequestOptions {
  model?: AiModel
  temperature?: number
  response_format?: { type: 'text' | 'json_object' }
}

interface AiRequestPrompts {
  system: string | OpenAI.Chat.Completions.ChatCompletionContentPartText[]
  user: string | OpenAI.Chat.Completions.ChatCompletionContentPart[]
}

interface ProviderConfig {
  apiKey: string | undefined
  baseURL: string | undefined
}

function getProviderConfig(model: AiModel): ProviderConfig {
  const isHubMix = AI_HUBMIX_MODELS.includes(model as typeof AI_HUBMIX_MODELS[number])

  return {
    apiKey: isHubMix ? process.env.AI_HUBMIX_KEY : process.env.AI_OPEN_ROUTER_KEY,
    baseURL: isHubMix ? process.env.AI_HUBMIX_API_URL : process.env.AI_OPEN_ROUTER_API_URL,
  }
}

function validateModel(model: string): model is AiModel {
  return AI_MODELS.includes(model as AiModel)
}

async function createAiChatRequest(
  prompt: AiRequestPrompts,
  options?: AiRequestOptions,
) {
  const mergedOptions = {
    model: 'google/gemini-2.0-flash-001',
    response_format: { type: 'json_object' },
    temperature: 0.4,
    ...options,
  } satisfies AiRequestOptions

  if (!validateModel(mergedOptions.model)) {
    throw new Error(`Invalid model: ${mergedOptions.model}. Available models: ${AI_MODELS.join(', ')}`)
  }

  const { apiKey, baseURL } = getProviderConfig(mergedOptions.model)

  const openai = new OpenAI({
    apiKey,
    baseURL,
  })

  return openai.chat.completions.create({
    messages: [
      { role: 'system', content: prompt.system },
      { role: 'user', content: prompt.user },
    ],
    model: mergedOptions.model,
    response_format: mergedOptions.response_format,
    temperature: mergedOptions.temperature,
    stream: false,
    web_search_options: mergedOptions.model.includes('search')
      ? {
        user_location: {
          approximate: {
            city: '北京', // Пекин
            country: '中国', // Китай
            region: '北京', // Пекин (регион/провинция)
            timezone: 'Asia/Shanghai', // Шанхайский часовой пояс (обычно используется для всего Китая)
          },
          type: 'approximate',
        },

      }
      : undefined,
  })
}

export {
  AI_MODELS,
  type AiModel,
  type AiRequestOptions,
  type AiRequestPrompts,
  createAiChatRequest,
}
