'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { CheckCircleIcon } from '@heroicons/react/24/outline'

export default function CheckoutSuccessPage() {
  const router = useRouter()

  // Redirect to home if accessed directly
  useEffect(() => {
    const timeout = setTimeout(() => {
      router.push('/')
    }, 10000) // Redirect after 10 seconds

    return () => clearTimeout(timeout)
  }, [router])

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <CheckCircleIcon className="mx-auto h-16 w-16 text-green-500" />
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900">Siparişiniz Alındı!</h1>
          <p className="mt-2 text-lg text-gray-500">
            Siparişiniz başarıyla oluşturuldu. Sipariş detaylarını e-posta adresinize gönderdik.
          </p>
          <div className="mt-6 space-x-4">
            <Link
              href="/"
              className="inline-flex items-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
            >
              Ana Sayfaya Dön
            </Link>
            <Link
              href="/profile/orders"
              className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              Siparişlerimi Görüntüle
            </Link>
          </div>
          <p className="mt-4 text-sm text-gray-500">
            10 saniye içinde ana sayfaya yönlendirileceksiniz...
          </p>
        </div>
      </div>
    </div>
  )
} 