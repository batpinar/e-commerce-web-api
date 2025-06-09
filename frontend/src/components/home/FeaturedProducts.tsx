'use client'

import Link from 'next/link'
import Image from 'next/image'
import { StarIcon } from '@heroicons/react/20/solid'
import { api } from '@/lib/api'
import useSWR from 'swr'

interface Product {
  id: string
  name: string
  slug: string
  price: number
  primaryPhotoUrl: string
  averageRating: number
  commentCount: number
}

interface ProductsResponse {
  products: Product[]
  total: number
  hasMore: boolean
}

const fetcher = async (url: string) => {
  try {
    const response = await api.get(url)
    return response.data
  } catch (error) {
    console.error('Error fetching featured products:', error)
    return { products: [] }
  }
}

export default function FeaturedProducts() {
  const { data, error, isLoading } = useSWR<ProductsResponse>('/api/products?limit=4', fetcher)

  if (error) {
    return (
      <div className="bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-lg bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Öne çıkan ürünler yüklenirken bir hata oluştu</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>Lütfen daha sonra tekrar deneyin.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Öne Çıkan Ürünler</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="group relative animate-pulse">
                <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200">
                  <div className="h-48 w-full bg-gray-300" />
                </div>
                <div className="mt-4 space-y-2">
                  <div className="h-4 w-3/4 bg-gray-300 rounded" />
                  <div className="h-4 w-1/2 bg-gray-300 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const products = data?.products || []

  if (products.length === 0) {
    return null
  }

  return (
    <div className="bg-white py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Öne Çıkan Ürünler</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.slug}`}
              className="group relative"
            >
              <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200">
                <Image
                  src={product.primaryPhotoUrl}
                  alt={product.name}
                  width={500}
                  height={500}
                  className="h-full w-full object-cover object-center group-hover:opacity-75"
                  priority={false}
                  loading="lazy"
                />
              </div>
              <div className="mt-4 flex justify-between">
                <div>
                  <h3 className="text-sm text-gray-700">{product.name}</h3>
                  <div className="mt-1 flex items-center">
                    {[0, 1, 2, 3, 4].map((rating) => (
                      <StarIcon
                        key={rating}
                        className={`h-4 w-4 flex-shrink-0 ${
                          rating < product.averageRating ? 'text-yellow-400' : 'text-gray-200'
                        }`}
                        aria-hidden="true"
                      />
                    ))}
                    <span className="ml-1 text-sm text-gray-500">({product.commentCount})</span>
                  </div>
                </div>
                <p className="text-sm font-medium text-gray-900">
                  {product.price.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
} 