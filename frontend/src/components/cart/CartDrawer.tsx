'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/lib/store/cart';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const router = useRouter();
  const { items, removeItem, updateItem } = useCartStore();

  if (!isOpen) return null;

  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-md">
          <div className="flex h-full flex-col bg-white shadow-xl">
            <div className="flex items-center justify-between px-4 py-6 border-b">
              <h2 className="text-lg font-medium">Sepetim</h2>
              <button
                onClick={onClose}
                className="rounded-md p-2 text-gray-400 hover:text-gray-500"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-6">
              {items.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">Sepetiniz boş</p>
                  <Button
                    onClick={() => {
                      onClose();
                      router.push('/products');
                    }}
                    className="mt-4"
                  >
                    Alışverişe Başla
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4">
                      <div className="relative h-24 w-24 flex-shrink-0">
                        <Image
                          src={item.product.images[0] || '/placeholder.png'}
                          alt={item.product.name}
                          fill
                          className="object-cover rounded-md"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-gray-900">{item.product.name}</h3>
                        <p className="mt-1 text-sm text-gray-500">
                          {item.product.price.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                        </p>
                        <div className="mt-2 flex items-center">
                          <button
                            onClick={() => updateItem(item.id, Math.max(1, item.quantity - 1))}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            -
                          </button>
                          <span className="mx-2 text-gray-700">{item.quantity}</span>
                          <button
                            onClick={() => updateItem(item.id, item.quantity + 1)}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-gray-200 px-4 py-6">
                <div className="flex justify-between text-base font-medium text-gray-900">
                  <p>Toplam</p>
                  <p>{total.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</p>
                </div>
                <div className="mt-6">
                  <Button
                    onClick={() => {
                      onClose();
                      router.push('/checkout');
                    }}
                    className="w-full"
                  >
                    Ödemeye Geç
                  </Button>
                </div>
                <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                  <p>
                    veya{' '}
                    <button
                      type="button"
                      className="font-medium text-primary-600 hover:text-primary-500"
                      onClick={() => {
                        onClose();
                        router.push('/products');
                      }}
                    >
                      Alışverişe Devam Et
                      <span aria-hidden="true"> &rarr;</span>
                    </button>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 