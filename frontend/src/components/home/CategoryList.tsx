'use client'

import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { api } from '@/lib/api'

interface Category {
  id: number
  name: string
  slug: string
  description: string
}

export default function CategoryList() {
  const { data: categories, isLoading } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: () => api.get('/api/categories').then(res => res.data)
  })

  if (isLoading) {
    return <div>Loading categories...</div>
  }

  return (
    <section className="py-12">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Categories</h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {categories?.map((category) => (
          <Link
            key={category.id}
            href={`/categories/${category.slug}`}
            className="group relative rounded-lg border border-gray-200 p-6 hover:border-primary-500 transition-colors"
          >
            <h3 className="text-lg font-medium text-gray-900 group-hover:text-primary-600">
              {category.name}
            </h3>
            <p className="mt-2 text-sm text-gray-500">{category.description}</p>
          </Link>
        ))}
      </div>
    </section>
  )
} 