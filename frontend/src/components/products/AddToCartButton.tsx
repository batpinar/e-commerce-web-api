'use client'

import { useState } from 'react'
import { api } from '@/lib/api'
import { useRouter } from 'next/navigation'

interface AddToCartButtonProps {
  productId: string
  className?: string
}

export default function AddToCartButton({ productId, className = '' }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleAddToCart = async () => {
    try {
      setIsLoading(true)
      await api.post('/api/cart/add', {
        productId,
        quantity,
      })
      router.refresh() // Refresh the page to update cart count
    } catch (error) {
      console.error('Error adding to cart:', error)
      // TODO: Show error toast
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={`flex items-center space-x-4 ${className}`}>
      <div className="flex items-center border border-gray-300 rounded-md">
        <button
          type="button"
          className="px-3 py-1 text-gray-600 hover:text-gray-700"
          onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
          disabled={isLoading}
        >
          -
        </button>
        <input
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
          className="w-16 text-center border-x border-gray-300 py-1"
          disabled={isLoading}
        />
        <button
          type="button"
          className="px-3 py-1 text-gray-600 hover:text-gray-700"
          onClick={() => setQuantity((prev) => prev + 1)}
          disabled={isLoading}
        >
          +
        </button>
      </div>
      <button
        type="button"
        onClick={handleAddToCart}
        disabled={isLoading}
        className="flex-1 bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Ekleniyor...' : 'Sepete Ekle'}
      </button>
    </div>
  )
} 