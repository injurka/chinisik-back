interface User {
  id: string

  email: string
  username?: string

  createdAt: Date
  updatedAt: Date
}

interface SignUpUserPayload {
  password: string
  email: string
  email_verification_code: string
}

interface SignInUserPayload {
  password: string
  email: string
}

export enum Permission {
  AiGenerate = 'AiGenerate',
}

export type {
  SignInUserPayload,
  SignUpUserPayload,
  User,
}
