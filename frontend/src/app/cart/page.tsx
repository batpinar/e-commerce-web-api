'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/lib/store/cart'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import Image from 'next/image'
import Link from 'next/link'
import { Plus, Minus, Trash2, ShoppingBag, Pencil } from 'lucide-react'

export default function CartPage() {
  const router = useRouter()
  const { items, total, setItems, setTotal, setLoading, setError } = useCartStore()
  const [isUpdating, setIsUpdating] = useState<string | null>(null)
  const [editingNote, setEditingNote] = useState<string | null>(null)
  const [noteText, setNoteText] = useState('')

  useEffect(() => {
    const fetchCart = async () => {
      setLoading(true)
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart`)
        if (!response.ok) {
          throw new Error('Sepet bilgileri alınamadı')
        }
        const data = await response.json()
        setItems(data.items)
        setTotal(data.total)
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Bir hata oluştu')
        toast.error(error instanceof Error ? error.message : 'Bir hata oluştu')
      } finally {
        setLoading(false)
      }
    }

    fetchCart()
  }, [setItems, setTotal, setLoading, setError])

  const handleQuantityChange = async (id: string, newQuantity: number) => {
    setIsUpdating(id)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/items/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity: newQuantity }),
      })

      if (!response.ok) {
        throw new Error('Ürün miktarı güncellenemedi')
      }

      const data = await response.json()
      setItems(items.map(item => 
        item.id === id ? { ...item, quantity: data.quantity } : item
      ))
      toast.success('Ürün miktarı güncellendi')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Bir hata oluştu')
    } finally {
      setIsUpdating(null)
    }
  }

  const handleNoteChange = async (id: string) => {
    setIsUpdating(id)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/items/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ note: noteText }),
      })

      if (!response.ok) {
        throw new Error('Not güncellenemedi')
      }

      const data = await response.json()
      setItems(items.map(item => 
        item.id === id ? { ...item, note: data.note } : item
      ))
      toast.success('Not güncellendi')
      setEditingNote(null)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Bir hata oluştu')
    } finally {
      setIsUpdating(null)
    }
  }

  const handleRemoveItem = async (id: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/items/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Ürün sepetten kaldırılamadı')
      }

      setItems(items.filter(item => item.id !== id))
      toast.success('Ürün sepetten kaldırıldı')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Bir hata oluştu')
    }
  }

  const handleClearCart = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Sepet temizlenemedi')
      }

      setItems([])
      setTotal(0)
      toast.success('Sepet temizlendi')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Bir hata oluştu')
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
            <h2 className="mt-2 text-lg font-medium text-gray-900">Sepetiniz boş</h2>
            <p className="mt-1 text-sm text-gray-500">
              Alışverişe başlamak için ürünlerimize göz atın.
            </p>
            <div className="mt-6">
              <Button
                onClick={() => router.push('/products')}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Alışverişe Başla
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Sepetim</h1>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="bg-white shadow-sm rounded-lg divide-y">
              {items.map((item) => (
                <div key={item.id} className="p-6">
                  <div className="flex items-center gap-6">
                    <div className="relative h-24 w-24 flex-shrink-0">
                      <Image
                        src={item.product.primaryPhotoUrl}
                        alt={item.product.name}
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>
                    <div className="flex-1">
                      <Link
                        href={`/products/${item.product.slug}`}
                        className="font-medium hover:underline"
                      >
                        {item.product.name}
                      </Link>
                      <p className="mt-1 text-sm text-gray-500">
                        {item.product.price.toLocaleString('tr-TR', {
                          style: 'currency',
                          currency: 'TRY',
                        })}
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          disabled={isUpdating === item.id || item.quantity <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          disabled={isUpdating === item.id || item.quantity >= item.product.stock}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveItem(item.id)}
                          className="ml-auto"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    {editingNote === item.id ? (
                      <div className="flex gap-2">
                        <Textarea
                          value={noteText}
                          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNoteText(e.target.value)}
                          placeholder="Not ekleyin..."
                          className="flex-1"
                        />
                        <div className="flex flex-col gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleNoteChange(item.id)}
                            disabled={isUpdating === item.id}
                          >
                            Kaydet
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingNote(null)
                              setNoteText('')
                            }}
                          >
                            İptal
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        {item.note ? (
                          <p className="text-sm text-gray-600 flex-1">{item.note}</p>
                        ) : (
                          <p className="text-sm text-gray-400 flex-1">Not eklemek için tıklayın</p>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setEditingNote(item.id)
                            setNoteText(item.note || '')
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-1">
            <div className="bg-white shadow-sm rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Sipariş Özeti</h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <p className="text-gray-500">Ara Toplam</p>
                  <p className="font-medium">
                    {total.toLocaleString('tr-TR', {
                      style: 'currency',
                      currency: 'TRY',
                    })}
                  </p>
                </div>
                <div className="flex justify-between">
                  <p className="text-gray-500">Kargo</p>
                  <p className="font-medium">Ücretsiz</p>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between">
                    <p className="text-lg font-medium">Toplam</p>
                    <p className="text-lg font-medium">
                      {total.toLocaleString('tr-TR', {
                        style: 'currency',
                        currency: 'TRY',
                      })}
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => router.push('/checkout')}
                  className="w-full mt-6"
                >
                  Ödemeye Geç
                </Button>
                <Button
                  variant="outline"
                  onClick={handleClearCart}
                  className="w-full"
                >
                  Sepeti Temizle
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 