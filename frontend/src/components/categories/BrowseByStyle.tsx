'use client';

import useSWR from 'swr';
import Link from 'next/link';
import Image from 'next/image';
import { api } from '@/lib/api';

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface CategoriesResponse {
  categories: Category[];
}

const fetcher = (url: string) => api.get(url).then((res) => res.data);

export default function BrowseByStyle() {
  const { data, error, isLoading } = useSWR<CategoriesResponse>('/api/categories', fetcher);

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Browse By Style</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Stil kategorileri yüklenirken bir hata oluştu</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>Lütfen daha sonra tekrar deneyin.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const categories = data?.categories || [];

  if (categories.length === 0) {
    return null;
  }

  return (
    <div className="bg-white py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Browse By Style</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {categories.map((category) => (
            <Link key={category.id} href={`/products?category=${category.slug}`} className="group relative">
              <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200">
                <Image
                  src={`https://picsum.photos/seed/${category.id}/200/200`}
                  alt={category.name}
                  width={200}
                  height={200}
                  className="h-24 w-24 object-cover object-center group-hover:opacity-75 mx-auto"
                  priority={false}
                  loading="lazy"
                />
              </div>
              <div className="mt-2">
                <h3 className="text-sm font-medium text-gray-900 text-center">
                  {category.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
} 