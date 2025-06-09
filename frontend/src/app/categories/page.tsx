'use client';

import useSWR from 'swr';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useState, useEffect } from 'react';

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string; // Assuming description might be available
}

interface CategoriesResponse {
  categories: Category[];
}

const fetcher = (url: string) => api.get(url).then((res) => res.data);

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(categories => setCategories(categories));
  }, []);

  const { data, error, isLoading } = useSWR<CategoriesResponse>('/api/categories', fetcher);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 mb-8">Kategoriler</h1>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 animate-pulse">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow">
                <div className="h-6 w-3/4 bg-gray-300 rounded mb-4" />
                <div className="h-4 w-full bg-gray-300 rounded mb-2" />
                <div className="h-4 w-5/6 bg-gray-300 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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
        </div>
      </div>
    );
  }

  if (!categories || categories.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="mt-2 text-sm font-semibold text-gray-900">Kategori bulunamadı</h3>
          <p className="mt-1 text-sm text-gray-500">Henüz hiç kategori eklenmemiş.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 mb-8">Kategoriler</h1>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <div key={category.id} className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
              <Link href={`/products?category=${category.slug}`} className="block">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">{category.name}</h2>
                {category.description && (
                  <p className="text-sm text-gray-600">{category.description}</p>
                )}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 