import OpenAI from 'openai'

const openai = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: process.env.DEEP_SEEK_KEY,
})

function createAiRequest(systemPromt: string, userPromt: string) {
  return openai.chat.completions.create({
    messages: [
      { role: 'system', content: systemPromt },
      { role: 'user', content: userPromt },
    ],
    model: 'deepseek-chat',
    response_format: {
      type: 'json_object',
    },
    stream: false,
    temperature: 1.3,
  })
}

export { createAiRequest, openai }
