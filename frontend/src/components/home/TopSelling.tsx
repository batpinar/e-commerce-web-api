'use client';

import React from 'react';

export default function TopSelling() {
  // Placeholder data for demonstration
  const placeholderProducts = Array.from({ length: 4 }); // Assuming 4 top selling products

  return (
    <div className="bg-white py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-8">Çok Satanlar</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {placeholderProducts.map((_, index) => (
            <div key={index} className="group relative animate-pulse">
              <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200">
                {/* Placeholder for image */}
                <div className="h-48 w-full bg-gray-300" />
              </div>
              <div className="mt-4 space-y-2">
                {/* Placeholder for product name */}
                <div className="h-4 w-3/4 bg-gray-300 rounded" />
                {/* Placeholder for product price */}
                <div className="h-4 w-1/2 bg-gray-300 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 