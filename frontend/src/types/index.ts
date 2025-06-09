export interface User {
  id: number
  name: string
  email: string
}

export interface Category {
  id: number
  name: string
  slug: string
  description: string
}

export interface Product {
  id: number
  name: string
  slug: string
  description: string
  price: number
  images: string[]
  primaryImage: string
  rating: number
  category: Category
}

export interface Review {
  id: number
  rating: number
  comment: string
  createdAt: string
  user: {
    name: string
  }
  product?: {
    id: number
    name: string
    slug: string
    primaryImage: string
  }
}

export interface LoginFormData {
  email: string
  password: string
}

export interface RegisterFormData {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export interface ReviewFormData {
  rating: number
  comment: string
} 