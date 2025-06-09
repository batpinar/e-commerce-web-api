'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { api } from '@/lib/api'
import useSWR from 'swr'
import { AxiosError } from 'axios'
import Link from 'next/link'

interface CartItem {
  id: string
  quantity: number
  product: {
    id: string
    name: string
    slug: string
    price: number
    primaryPhotoUrl: string
  }
}

interface Cart {
  id: string
  items: CartItem[]
}

interface AddressFormData {
  fullName: string
  phone: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
}

const fetcher = async (url: string) => {
  try {
    const response = await api.get(url)
    return response.data
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error('Error fetching data:', url, error)
      if (error.response) {
        console.error('Response data:', error.response.data)
        console.error('Response status:', error.response.status)
      }
    }
    throw error
  }
}

export default function CheckoutPage() {
  const router = useRouter()
  const { data: cart, error, isLoading } = useSWR<Cart>('/api/cart', fetcher)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<'creditCard' | 'bankTransfer'>('creditCard')
  const [addressFormData, setAddressFormData] = useState<AddressFormData>({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Türkiye',
  })

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setAddressFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!cart || cart.items.length === 0) return

    try {
      setIsSubmitting(true)
      // TODO: Implement payment processing
      // For now, just redirect to success page
      router.push('/checkout/success')
    } catch (error) {
      console.error('Error processing payment:', error)
      // TODO: Show error toast
    } finally {
      setIsSubmitting(false)
    }
  }

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
                <h3 className="text-sm font-medium text-red-800">Sepet yüklenirken bir hata oluştu</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>Lütfen daha sonra tekrar deneyin.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 w-48 bg-gray-300 rounded mb-8" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="h-10 bg-gray-300 rounded" />
                <div className="h-10 bg-gray-300 rounded" />
                <div className="h-10 bg-gray-300 rounded" />
                <div className="h-10 bg-gray-300 rounded" />
              </div>
              <div className="space-y-4">
                <div className="h-32 bg-gray-300 rounded" />
                <div className="h-32 bg-gray-300 rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">Sepetiniz boş</h2>
            <p className="mt-2 text-sm text-gray-500">
              Ödeme yapabilmek için sepetinizde ürün bulunmalıdır.
            </p>
            <div className="mt-6">
              <Link
                href="/products"
                className="inline-flex items-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
              >
                Alışverişe Başla
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const subtotal = cart.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const shipping = 0 // TODO: Implement shipping cost calculation
  const total = subtotal + shipping

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Ödeme</h1>

        <form onSubmit={handleSubmit} className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Address Form */}
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-medium text-gray-900">Teslimat Adresi</h2>
              <div className="mt-4 grid grid-cols-1 gap-4">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                    Ad Soyad
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    required
                    value={addressFormData.fullName}
                    onChange={handleAddressChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Telefon
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    value={addressFormData.phone}
                    onChange={handleAddressChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                    Adres
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    required
                    value={addressFormData.address}
                    onChange={handleAddressChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                      İl
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      required
                      value={addressFormData.city}
                      onChange={handleAddressChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                      İlçe
                    </label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      required
                      value={addressFormData.state}
                      onChange={handleAddressChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">
                    Posta Kodu
                  </label>
                  <input
                    type="text"
                    id="zipCode"
                    name="zipCode"
                    required
                    value={addressFormData.zipCode}
                    onChange={handleAddressChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Selection */}
            <div>
              <h2 className="text-lg font-medium text-gray-900">Ödeme Yöntemi</h2>
              <div className="mt-4 space-y-4">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="creditCard"
                    name="paymentMethod"
                    value="creditCard"
                    checked={paymentMethod === 'creditCard'}
                    onChange={() => setPaymentMethod('creditCard')}
                    className="h-4 w-4 border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <label htmlFor="creditCard" className="ml-3 block text-sm font-medium text-gray-700">
                    Kredi Kartı
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="radio"
                    id="bankTransfer"
                    name="paymentMethod"
                    value="bankTransfer"
                    checked={paymentMethod === 'bankTransfer'}
                    onChange={() => setPaymentMethod('bankTransfer')}
                    className="h-4 w-4 border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <label htmlFor="bankTransfer" className="ml-3 block text-sm font-medium text-gray-700">
                    Havale/EFT
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-medium text-gray-900">Sipariş Özeti</h2>
            <div className="mt-6 flow-root">
              <ul role="list" className="-my-4 divide-y divide-gray-200">
                {cart.items.map((item) => (
                  <li key={item.id} className="flex items-center py-4">
                    <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                      <Image
                        src={item.product.primaryPhotoUrl}
                        alt={item.product.name}
                        width={64}
                        height={64}
                        className="h-full w-full object-cover object-center"
                      />
                    </div>

                    <div className="ml-4 flex flex-1 flex-col">
                      <div>
                        <div className="flex justify-between text-base font-medium text-gray-900">
                          <h3>{item.product.name}</h3>
                          <p className="ml-4">
                            {(item.product.price * item.quantity).toLocaleString('tr-TR', {
                              style: 'currency',
                              currency: 'TRY',
                            })}
                          </p>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">Adet: {item.quantity}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex justify-between text-base font-medium text-gray-900">
                <p>Ara Toplam</p>
                <p>{subtotal.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</p>
              </div>
              <div className="flex justify-between text-base font-medium text-gray-900">
                <p>Kargo</p>
                <p>{shipping.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</p>
              </div>
              <div className="flex justify-between text-lg font-medium text-gray-900">
                <p>Toplam</p>
                <p>{total.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</p>
              </div>
            </div>

            <div className="mt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-md border border-transparent bg-primary-600 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'İşleniyor...' : 'Ödemeyi Tamamla'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
} 