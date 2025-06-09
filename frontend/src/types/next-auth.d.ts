import 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: number
      name: string
      email: string
    }
  }

  interface User {
    id: number
    name: string
    email: string
  }
} 