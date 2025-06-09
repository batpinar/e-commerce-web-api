'use client'

import { useState } from 'react'
import { StarIcon } from '@heroicons/react/20/solid'
import { api } from '@/lib/api'
import useSWR from 'swr'

interface AddReviewFormProps {
  productId: string
}

export default function AddReviewForm({ productId }: AddReviewFormProps) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [rating, setRating] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { mutate } = useSWR(`/api/products/${productId}`)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      await api.post(`/api/products/${productId}/reviews`, {
        title,
        content,
        rating,
      })

      // Reset form
      setTitle('')
      setContent('')
      setRating(0)

      // Refresh product data
      mutate()
    } catch (err) {
      setError('Değerlendirme eklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8">
      <div className="space-y-6">
        <div>
          <label htmlFor="rating" className="block text-sm font-medium text-gray-700">
            Puanınız
          </label>
          <div className="mt-2 flex items-center">
            {[0, 1, 2, 3, 4].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setRating(value + 1)}
                className="focus:outline-none"
              >
                <StarIcon
                  className={`h-8 w-8 ${
                    value < rating ? 'text-yellow-400' : 'text-gray-200'
                  }`}
                  aria-hidden="true"
                />
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Başlık
          </label>
          <div className="mt-2">
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            />
          </div>
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700">
            Değerlendirmeniz
          </label>
          <div className="mt-2">
            <textarea
              id="content"
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            />
          </div>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div>
          <button
            type="submit"
            disabled={isSubmitting || !rating}
            className="inline-flex justify-center rounded-md border border-transparent bg-primary-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Gönderiliyor...' : 'Değerlendirme Ekle'}
          </button>
        </div>
      </div>
    </form>
  )
} 