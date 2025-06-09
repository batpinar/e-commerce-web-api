'use client'

import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { api } from '@/lib/api'
import { useState } from 'react'

interface Product {
  id: number
  name: string
  slug: string
  price: number
  description: string
  primaryImage: string
  rating: number
}

interface Category {
  id: number
  name: string
  slug: string
  description: string
}

export default function CategoryPage() {
  const { slug } = useParams()
  const [sortBy, setSortBy] = useState<string>('newest')

  const { data: category, isLoading: isLoadingCategory } = useQuery<Category>({
    queryKey: ['category', slug],
    queryFn: () => api.get(`/api/categories/${slug}`).then(res => res.data)
  })

  const { data: products, isLoading: isLoadingProducts } = useQuery<Product[]>({
    queryKey: ['products', slug, sortBy],
    queryFn: () => {
      const params = new URLSearchParams()
      params.append('category', slug as string)
      if (sortBy) params.append('sort', sortBy)
      return api.get(`/api/products?${params.toString()}`).then(res => res.data)
    }
  })

  if (isLoadingCategory || isLoadingProducts) {
    return <div>Loading...</div>
  }

  if (!category) {
    return <div>Category not found</div>
  }

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {category.name}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-gray-500">
            {category.description}
          </p>
        </div>

        <div className="mt-8 flex justify-end">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
          >
            <option value="newest">Newest</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {products?.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.slug}`}
              className="group"
            >
              <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200">
                <Image
                  src={product.primaryImage}
                  alt={product.name}
                  width={500}
                  height={500}
                  className="h-full w-full object-cover object-center group-hover:opacity-75"
                />
              </div>
              <div className="mt-4 flex justify-between">
                <div>
                  <h3 className="text-sm text-gray-700">{product.name}</h3>
                </div>
                <p className="text-sm font-medium text-gray-900">
                  ${product.price.toFixed(2)}
                </p>
              </div>
              <div className="mt-2 flex items-center">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating)
                          ? 'text-yellow-400'
                          : 'text-gray-300'
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="ml-2 text-sm text-gray-500">
                  {product.rating.toFixed(1)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
} 