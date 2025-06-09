'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { StarIcon } from '@heroicons/react/20/solid'
import ProductReviews from '@/components/products/ProductReviews'
import AddReviewForm from '@/components/products/AddReviewForm'
import AddToCartButton from '@/components/products/AddToCartButton'
import { api } from '@/lib/api'
import useSWR from 'swr'
import { AxiosError } from 'axios'
import { ProductCard } from '@/components/products/ProductCard'

// Assuming product data structure includes productPhotos and category
interface ProductPhoto {
  id: string;
  url: string;
  order: number;
  isPrimary: boolean;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  primaryPhotoUrl: string;
  longDescription: string;
  averageRating: number;
  commentCount: number;
  productComments: any[]; // Replace with actual Review type if needed
  productPhotos: ProductPhoto[];
  category: Category; // Assuming category is included
}

interface ProductsResponse {
  products: Product[]
  total: number
  hasMore: boolean
}

const fetcher = async (url: string) => {
  try {
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error('Error fetching data:', url, error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
      }
    }
    throw error;
  }
};

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  const { data: product, error, isLoading } = useSWR<Product>(`/api/products/${params.slug}`, fetcher);

  const [mainImageUrl, setMainImageUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (product?.primaryPhotoUrl) {
      setMainImageUrl(product.primaryPhotoUrl);
    }
  }, [product]);

  // Fetch similar products based on category
  const categorySlug = product?.category?.slug;
  const { data: similarProductsData, error: similarProductsError, isLoading: isLoadingSimilarProducts } = useSWR<ProductsResponse>(
    categorySlug ? `/api/products?category=${categorySlug}&limit=4` : null,
    fetcher
  );

  const similarProducts = similarProductsData?.products || [];

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
                <h3 className="text-sm font-medium text-red-800">Ürün yüklenirken bir hata oluştu</h3>
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse lg:grid lg:grid-cols-2 lg:gap-x-8">
             {/* Image gallery placeholder */}
            <div className="lg:max-w-lg lg:self-start">
               <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200 mb-4">
                <div className="h-96 w-full bg-gray-300" />
              </div>
              <div className="grid grid-cols-4 gap-4">
                 {[...Array(4)].map((_, index) => (
                  <div key={index} className="aspect-h-1 aspect-w-1 overflow-hidden rounded-lg bg-gray-200">
                    <div className="h-20 w-full bg-gray-300" />
                  </div>
                ))}
              </div>
            </div>
            {/* Product info placeholder */}
            <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
              <div className="h-8 w-3/4 bg-gray-300 rounded mb-4" />
              <div className="h-4 w-1/2 bg-gray-300 rounded mb-4" />
              <div className="h-4 w-full bg-gray-300 rounded mb-2" />
              <div className="h-4 w-full bg-gray-300 rounded mb-2" />
              <div className="h-4 w-3/4 bg-gray-300 rounded" />
               <div className="mt-8 h-10 w-32 bg-gray-300 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="mt-2 text-sm font-semibold text-gray-900">Ürün bulunamadı</h3>
            <p className="mt-1 text-sm text-gray-500">Aradığınız ürün mevcut değil veya kaldırılmış olabilir.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-x-8">
          {/* Product images */}
          <div className="lg:max-w-lg lg:self-start">
             {/* Main Image */}
            <div className="aspect-h-1 aspect-w-1 overflow-hidden rounded-lg mb-4">
              {mainImageUrl && (
                <Image
                  src={mainImageUrl}
                  alt={product?.name || 'Product Image'}
                  width={800}
                  height={800}
                  className="h-full w-full object-cover object-center"
                  priority
                />
              )}
            </div>

            {/* Image Gallery */}
            <div className="grid grid-cols-4 gap-4">
              {product?.productPhotos
                ?.sort((a, b) => a.order - b.order) // Sort by order
                .map((photo) => (
                <div
                  key={photo.id}
                  className={`aspect-h-1 aspect-w-1 overflow-hidden rounded-lg border-2 ${photo.url === mainImageUrl ? 'border-primary-500' : 'border-transparent'} cursor-pointer`}
                  onClick={() => setMainImageUrl(photo.url)}
                >
                  <Image
                    src={photo.url}
                    alt={`Product image ${photo.order}`}
                    width={100}
                    height={100}
                    className="h-full w-full object-cover object-center"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product info */}
          <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">{product?.name}</h1>

            <div className="mt-3">
              <h2 className="sr-only">Product information</h2>
              <p className="text-3xl tracking-tight text-gray-900">
                {product?.price?.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
              </p>
            </div>

            <div className="mt-6">
              <h3 className="sr-only">Description</h3>
              {/* Using optional chaining for longDescription as well */}
              {product?.longDescription && (
                <div className="space-y-6 text-base text-gray-700" dangerouslySetInnerHTML={{ __html: product.longDescription }} />
              )}
            </div>

            <div className="mt-6">
              <div className="flex items-center">
                <div className="flex items-center">
                  {[0, 1, 2, 3, 4].map((rating) => (
                    <StarIcon
                      key={rating}
                      className={`h-5 w-5 flex-shrink-0 ${
                        rating < (product?.averageRating || 0) ? 'text-yellow-400' : 'text-gray-200'
                      }`}
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <p className="ml-3 text-sm text-gray-500">
                  {product?.commentCount ?? 0} değerlendirme
                </p>
              </div>
            </div>

            <div className="mt-8">
              {product?.id && <AddToCartButton productId={product.id} />}
            </div>

          </div>
        </div>

        {/* Reviews */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Değerlendirmeler</h2>
          <div className="mt-6">
            {/* Pass reviews only if product and productComments are defined */}
            {product?.productComments && <ProductReviews reviews={product.productComments} />}
          </div>
          <div className="mt-6">
            {/* Pass product ID only if product is defined */}
            {product?.id && <AddReviewForm productId={product.id} />}
          </div>
        </div>

         {/* Similar Products Section */}
         {similarProducts.length > 0 && (
           <div className="mt-16">
             <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-8">Benzer Ürünler</h2>
              {isLoadingSimilarProducts ? (
                <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8 animate-pulse">
                  {[...Array(4)].map((_, index) => (
                    <ProductCard key={index} id="" name="" slug="" price={0} primaryPhotoUrl="" averageRating={0} commentCount={0} isLoading={true} />
                  ))}
                </div>
              ) : similarProductsError ? (
                <div className="rounded-md bg-red-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">Benzer ürünler yüklenirken bir hata oluştu</h3>
                      <div className="mt-2 text-sm text-red-700">
                        <p>Lütfen daha sonra tekrar deneyin.</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                  {similarProducts.map((similarProduct) => (
                    <ProductCard
                      key={similarProduct.id}
                      id={similarProduct.id}
                      name={similarProduct.name}
                      slug={similarProduct.slug}
                      price={similarProduct.price}
                      primaryPhotoUrl={similarProduct.primaryPhotoUrl}
                      averageRating={similarProduct.averageRating}
                      commentCount={similarProduct.commentCount}
                    />
                  ))}
                </div>
              )}
           </div>
         )}

      </div>
    </div>
  )
} 