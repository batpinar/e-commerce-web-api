export class CartItemResponseDto {
  id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    primaryPhotoUrl: string | null;
    slug: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export class CartResponseDto {
  id: string;
  userId: string;
  items: CartItemResponseDto[];
  createdAt: Date;
  updatedAt: Date;
  totalItems: number;
  totalPrice: number;
}
