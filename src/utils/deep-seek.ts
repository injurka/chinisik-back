import OpenAI from 'openai'

const openai = new OpenAI({
  baseURL: 'https://api.deepseek.com/beta',
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
    temperature: 0.8,
  })
}

export { createAiRequest, openai }
