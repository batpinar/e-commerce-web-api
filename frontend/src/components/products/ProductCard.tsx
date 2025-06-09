'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Heart } from 'lucide-react';
import { useCartStore } from '@/lib/store/cart';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';

interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  price: number;
  primaryPhotoUrl: string;
  averageRating: number;
  commentCount: number;
  isLoading?: boolean;
}

export default function ProductCard({ 
  id, 
  name, 
  slug, 
  price, 
  primaryPhotoUrl, 
  averageRating, 
  commentCount,
  isLoading = false 
}: ProductCardProps) {
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = async () => {
    try {
      setIsAddingToCart(true);
      await addItem({
        id,
        product: {
          id,
          name,
          price,
          stock: 1,
          images: [primaryPhotoUrl],
          category: {
            name: ''
          }
        },
        quantity: 1
      });
      toast.success('Ürün sepete eklendi');
    } catch (error) {
      toast.error('Ürün sepete eklenirken bir hata oluştu');
    } finally {
      setIsAddingToCart(false);
    }
  };

  if (isLoading) {
    return (
      <div className="group relative bg-white rounded-lg shadow-sm overflow-hidden animate-pulse">
        <div className="aspect-square bg-gray-200" />
        <div className="p-4">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
          <div className="h-4 bg-gray-200 rounded w-1/4" />
        </div>
      </div>
    );
  }

  return (
    <div className="group relative bg-white rounded-lg shadow-sm overflow-hidden">
      <Link href={`/products/${slug}`} className="block aspect-square relative">
        <Image
          src={primaryPhotoUrl || '/placeholder.png'}
          alt={name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </Link>
      <div className="p-4">
        <Link href={`/products/${slug}`} className="block">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{name}</h3>
          <p className="text-lg font-bold text-primary-600">{price.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</p>
        </Link>
        <div className="mt-4 flex items-center gap-2">
          <Button
            onClick={handleAddToCart}
            disabled={isAddingToCart}
            className="flex-1"
            variant="outline"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Sepete Ekle
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-gray-100"
          >
            <Heart className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
} 