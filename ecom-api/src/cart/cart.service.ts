import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}

  async getCartByUserId(userId: string) {
    let cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                primaryPhotoUrl: true,
                slug: true,
              },
            },
          },
        },
      },
    });

    if (!cart) {
      cart = await this.prisma.cart.create({
        data: {
          userId,
        },
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  price: true,
                  primaryPhotoUrl: true,
                  slug: true,
                },
              },
            },
          },
        },
      });
    }

    // Calculate totals
    const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.items.reduce((sum, item) => sum + (item.quantity * item.product.price), 0);

    return {
      ...cart,
      totalItems,
      totalPrice,
    };
  }

  async addItemToCart(userId: string, productId: string, quantity: number) {
    // Önce ürünün var olup olmadığını kontrol et
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      select: {
        id: true,
        name: true,
        price: true,
        stockQuantity: true,
        primaryPhotoUrl: true,
        slug: true,
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Stok kontrolü
    if (product.stockQuantity <= 0) {
      throw new BadRequestException('Product is out of stock');
    }

    if (quantity > product.stockQuantity) {
      throw new BadRequestException(`Only ${product.stockQuantity} items available in stock`);
    }

    const cart = await this.getCartByUserId(userId);

    const existingItem = await this.prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId,
      },
    });

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;
      
      // Toplam miktar stoktan fazla olmamalı
      if (newQuantity > product.stockQuantity) {
        throw new BadRequestException(`Cannot add ${quantity} items. Only ${product.stockQuantity - existingItem.quantity} more items can be added`);
      }

      return this.prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQuantity },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              price: true,
              stockQuantity: true,
              primaryPhotoUrl: true,
              slug: true,
            },
          },
        },
      });
    }

    return this.prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        quantity,
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            stockQuantity: true,
            primaryPhotoUrl: true,
            slug: true,
          },
        },
      },
    });
  }

  async updateCartItemQuantity(userId: string, cartItemId: string, quantity: number) {
    const cart = await this.getCartByUserId(userId);

    const cartItem = await this.prisma.cartItem.findFirst({
      where: {
        id: cartItemId,
        cartId: cart.id,
      },
      include: {
        product: {
          select: {
            id: true,
            stockQuantity: true,
          },
        },
      },
    });

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    if (quantity <= 0) {
      return this.removeCartItem(userId, cartItemId);
    }

    // Stok kontrolü
    if (quantity > cartItem.product.stockQuantity) {
      throw new BadRequestException(`Only ${cartItem.product.stockQuantity} items available in stock`);
    }

    return this.prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            stockQuantity: true,
            primaryPhotoUrl: true,
            slug: true,
          },
        },
      },
    });
  }

  async removeCartItem(userId: string, cartItemId: string) {
    const cart = await this.getCartByUserId(userId);

    const cartItem = await this.prisma.cartItem.findFirst({
      where: {
        id: cartItemId,
        cartId: cart.id,
      },
    });

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    return this.prisma.cartItem.delete({
      where: { id: cartItemId },
    });
  }

  async clearCart(userId: string) {
    const cart = await this.getCartByUserId(userId);

    await this.prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    return this.getCartByUserId(userId);
  }
}
