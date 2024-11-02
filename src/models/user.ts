interface User {
  id: string

  email: string
  username?: string

  createdAt: Date
  updatedAt: Date
}

export enum Permission {
  AiGenerate = 'AiGenerate',
}

export type {
  User,
}
