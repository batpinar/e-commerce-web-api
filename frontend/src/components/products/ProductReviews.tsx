'use client'

import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { StarIcon } from '@heroicons/react/20/solid'

interface Review {
  id: string
  title: string
  content: string
  rating: number
  createdAt: string
  user: {
    id: string
    fullName: string
  }
}

interface ProductReviewsProps {
  reviews: Review[]
}

export default function ProductReviews({ reviews }: ProductReviewsProps) {
  if (!reviews?.length) {
    return (
      <div className="text-center py-12">
        <h3 className="mt-2 text-sm font-semibold text-gray-900">Henüz değerlendirme yok</h3>
        <p className="mt-1 text-sm text-gray-500">Bu ürün için henüz değerlendirme yapılmamış.</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {reviews.map((review) => (
        <div key={review.id} className="border-b border-gray-200 pb-8">
          <div className="flex items-center">
            <div className="flex items-center">
              {[0, 1, 2, 3, 4].map((rating) => (
                <StarIcon
                  key={rating}
                  className={`h-5 w-5 flex-shrink-0 ${
                    rating < review.rating ? 'text-yellow-400' : 'text-gray-200'
                  }`}
                  aria-hidden="true"
                />
              ))}
            </div>
            <p className="ml-3 text-sm text-gray-500">
              {new Date(review.createdAt).toLocaleDateString('tr-TR')}
            </p>
          </div>

          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-900">{review.title}</h4>
            <p className="mt-2 text-sm text-gray-500">{review.content}</p>
          </div>

          <div className="mt-4">
            <p className="text-sm font-medium text-gray-900">{review.user.fullName}</p>
          </div>
        </div>
      ))}
    </div>
  )
} 