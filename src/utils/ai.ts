import OpenAI from 'openai'

const AI_DEEPSEEK_MODELS = ['deepseek-chat'] as const
const AI_OPENROUTER_MODELS = [
  'deepseek/deepseek-r1-distill-llama-70b',
  'deepseek/deepseek-chat',
  'google/gemini-flash-1.5-8b',
  'google/gemini-flash-1.5',
  'mistralai/mistral-small-24b-instruct-2501',
] as const

const AI_MODELS = [...AI_DEEPSEEK_MODELS, ...AI_OPENROUTER_MODELS] as const

type AiModel = typeof AI_MODELS[number]

interface AiRequestOptions {
  model?: AiModel
  temperature?: number
  response_format?: { type: 'text' | 'json_object' }
}

interface ProviderConfig {
  apiKey: string | undefined
  baseURL: string | undefined
}

function getProviderConfig(model: AiModel): ProviderConfig {
  const isDeepSeek = AI_DEEPSEEK_MODELS.includes(model as typeof AI_DEEPSEEK_MODELS[number])

  return {
    apiKey: isDeepSeek ? process.env.AI_DEEP_SEEK_KEY : process.env.AI_OPEN_ROUTER_KEY,
    baseURL: isDeepSeek ? process.env.AI_DEEP_SEEK_API_URL : process.env.AI_OPEN_ROUTER_API_URL,
  }
}

function validateModel(model: string): model is AiModel {
  return AI_MODELS.includes(model as AiModel)
}

async function createAiRequest(
  prompt: {
    system: string
    user: string
  },
  options?: AiRequestOptions,
) {
  const mergedOptions = {
    model: 'deepseek-chat',
    response_format: { type: 'json_object' },
    temperature: 0.7,
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
  })
}

export { AI_MODELS, type AiModel, createAiRequest }
