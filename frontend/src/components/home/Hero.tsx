'use client'

import Link from 'next/link'

export default function Hero() {
  return (
    <div className="relative bg-primary-600">
      <div className="container mx-auto px-4 py-16 sm:py-24">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
            <span className="block">Welcome to Our Store</span>
            <span className="block text-primary-200">Discover Amazing Products</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-primary-100">
            Explore our wide range of products, from electronics to fashion. Find the best deals and shop with confidence.
          </p>
          <div className="mt-10">
            <Link
              href="/products"
              className="rounded-md bg-white px-8 py-3 text-base font-medium text-primary-600 hover:bg-primary-50"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 