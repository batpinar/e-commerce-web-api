'use client';

import useSWR from 'swr';
import Link from 'next/link';
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

export default function CategoryList() {
  const { data, error, isLoading } = useSWR<CategoriesResponse>('/api/categories', fetcher);

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 w-48 bg-gray-300 rounded mb-4" />
        <div className="space-y-2">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="h-6 w-32 bg-gray-300 rounded" />
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
            <h3 className="text-sm font-medium text-red-800">Kategoriler yüklenirken bir hata oluştu</h3>
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
    return (
      <div className="text-center py-4">
        <h3 className="mt-2 text-sm font-semibold text-gray-900">Kategori bulunamadı</h3>
        <p className="mt-1 text-sm text-gray-500">Henüz hiç kategori eklenmemiş.</p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Kategoriler</h3>
      <ul className="space-y-2">
        {categories.map((category) => (
          <li key={category.id}>
            <Link href={`/products?category=${category.slug}`} className="text-sm text-gray-600 hover:text-gray-900">
              {category.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
} 