'use client';

import { Suspense } from 'react'
import FeaturedProducts from '@/components/home/FeaturedProducts'
import CategoryList from '@/components/home/CategoryList'
import Hero from '@/components/home/Hero'
import BrowseByStyle from '@/components/categories/BrowseByStyle'
import NewArrivals from '@/components/home/NewArrivals'
import TopSelling from '@/components/home/TopSelling'
import HappyCustomers from '@/components/home/HappyCustomers'
import StayUpdated from '@/components/home/StayUpdated'
import BrandLogos from '@/components/home/BrandLogos'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section - Placeholder */}
        <section className="bg-white py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">Find Clothes That Matches Your Style</h1>
            <p className="mt-6 text-xl leading-8 text-gray-700">Browse through our diverse range of meticulously crafted garments, designed to bring out your individuality and cater to your sense of style.</p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <a
                href="/products"
                className="rounded-md bg-primary-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
              >
                Shop Now
              </a>
              <a href="#" className="text-sm font-semibold leading-6 text-gray-900">Learn More <span aria-hidden="true">→</span></a>
            </div>
          </div>
        </section>

        {/* Brand Logos Section */}
        <BrandLogos />

        {/* Featured Products Section */}
        <FeaturedProducts />

        {/* Browse By Style Section */}
        <BrowseByStyle />

        {/* New Arrivals Section */}
        <NewArrivals />

        {/* Top Selling Section */}
        <TopSelling />

        {/* Happy Customers Section */}
        <HappyCustomers />

        {/* Stay Updated Section */}
        <StayUpdated />

        {/* TODO: Add Happy Customers, Stay Updated sections based on Figma */}

      </main>
    </div>
  )
} 