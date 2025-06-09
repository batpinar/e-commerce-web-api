'use client'

import { useEffect, useState } from 'react'
import useSWRInfinite from 'swr/infinite'
import ProductCard from '@/components/products/ProductCard'
import { api } from '@/lib/api'
import { AxiosError } from 'axios'
import useSWR from 'swr'

const ITEMS_PER_PAGE = 20

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

interface Category {
  id: string;
  name: string;
  slug: string;
}

const fetcher = async (url: string) => {
  try {
    const response = await api.get(url)
    return response.data
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error('Error fetching products:', error)
      if (error.response) {
        console.error('Response data:', error.response.data)
        console.error('Response status:', error.response.status)
      }
    }
    throw error
  }
}

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedSort, setSelectedSort] = useState<string>('newest');

  const { data: categoriesData } = useSWR<{
    categories: Category[];
  }>('/api/categories', fetcher);

  const categories = categoriesData?.categories || [];

  const getKey = (pageIndex: number, previousPageData: ProductsResponse | null) => {
    if (previousPageData && !previousPageData.hasMore) return null
    // Include category and sort parameters in the API call
    let url = `/api/products?page=${pageIndex + 1}&limit=${ITEMS_PER_PAGE}`;
    if (selectedCategory) {
      url += `&category=${selectedCategory}`;
    }
    if (selectedSort) {
      url += `&sort=${selectedSort}`;
    }
    return url;
  }

  const { data, error, isLoading, size, setSize, isValidating, mutate } = useSWRInfinite<ProductsResponse>(
    getKey,
    fetcher,
    {
      revalidateFirstPage: false,
      revalidateOnFocus: false,
      shouldRetryOnError: true,
      errorRetryCount: 3,
    }
  )

  const products = data ? data.flatMap((page) => page.products) : []
  const isLoadingMore = isLoading || (size > 0 && data && typeof data[size - 1] === 'undefined')
  const isEmpty = data?.[0]?.products.length === 0
  const isReachingEnd = isEmpty || (data && data[data.length - 1]?.hasMore === false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isReachingEnd && !isValidating) {
          setSize((size) => size + 1)
        }
      },
      { threshold: 0.1 }
    )

    const element = document.getElementById('load-more-trigger')
    if (element) observer.observe(element)

    return () => {
      if (element) observer.unobserve(element)
    }
  }, [isReachingEnd, isValidating, setSize])

  // Reset pagination and refetch data when category or sort changes
  useEffect(() => {
    setSize(1); // Reset to the first page
    mutate(); // Trigger a refetch
  }, [selectedCategory, selectedSort, mutate, setSize]);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-lg bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Ürünler yüklenirken bir hata oluştu</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>Lütfen daha sonra tekrar deneyin.</p>
                  {error.response?.data?.message && (
                    <p className="mt-1 text-xs text-red-600">{error.response.data.message}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-none">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 mb-8">Tüm Ürünler</h1>

          {/* Filter and Sort Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8 space-y-4 sm:space-y-0">
            {/* Category Filter */}
            <div>
              <label htmlFor="category-filter" className="mr-2 text-sm font-medium text-gray-700">Kategori:</label>
              <select
                id="category-filter"
                name="category-filter"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              >
                <option value="">Tüm Kategoriler</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.slug}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label htmlFor="sort-by" className="mr-2 text-sm font-medium text-gray-700">Sırala:</label>
              <select
                id="sort-by"
                name="sort-by"
                value={selectedSort}
                onChange={(e) => setSelectedSort(e.target.value)}
                className="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              >
                <option value="newest">En Yeniler</option>
                <option value="price_asc">Fiyata Göre (Artan)</option>
                <option value="price_desc">Fiyata Göre (Azalan)</option>
                <option value="rating">Puana Göre</option>
              </select>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {isLoading ? (
              // Loading skeletons
              Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
                <ProductCard
                  key={index}
                  id=""
                  name=""
                  slug=""
                  price={0}
                  primaryPhotoUrl=""
                  averageRating={0}
                  commentCount={0}
                  isLoading={true}
                />
              ))
            ) : isEmpty ? (
              <div className="col-span-full text-center py-12">
                <h3 className="mt-2 text-sm font-semibold text-gray-900">Ürün bulunamadı</h3>
                <p className="mt-1 text-sm text-gray-500">Seçtiğiniz filtre ve sıralama kriterlerine uygun ürün bulunamadı.</p>
              </div>
            ) : (
              products.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  slug={product.slug}
                  price={product.price}
                  primaryPhotoUrl={product.primaryPhotoUrl}
                  averageRating={product.averageRating}
                  commentCount={product.commentCount}
                />
              ))
            )}
          </div>

          {/* Infinite scroll trigger */}
          {!isLoading && !isEmpty && !isReachingEnd && (
            <div id="load-more-trigger" className="h-10 w-full" />
          )}

          {/* Loading indicator */}
          {isLoadingMore && (
            <div className="mt-8 flex justify-center">
              <div className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-gray-700 shadow-sm">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Yükleniyor...
              </div>
            </div>
          )}

          {/* No more products message */}
          {!isLoading && !isEmpty && isReachingEnd && (
            <div className="mt-8 text-center text-gray-500 text-sm">
              Tüm ürünler yüklendi.
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 