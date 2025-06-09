import { Controller, Get, Post, Body, Param, UsePipes, ValidationPipe, Patch, Delete } from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

// TODO: Replace with actual user ID from authentication
const HARDCODED_USER_ID = 'user-123';

@Controller('cart')
@UsePipes(new ValidationPipe())
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  async getCart() {
    // In a real app, get userId from auth context
    return this.cartService.getCartByUserId(HARDCODED_USER_ID);
  }

  @Post('items')
  async addItemToCart(@Body() addToCartDto: AddToCartDto) {
    // In a real app, get userId from auth context
    return this.cartService.addItemToCart(
      HARDCODED_USER_ID,
      addToCartDto.productId,
      addToCartDto.quantity
    );
  }

  @Patch('items/:id')
  async updateCartItemQuantity(
    @Param('id') cartItemId: string,
    @Body() updateCartItemDto: UpdateCartItemDto
  ) {
    // In a real app, get userId from auth context
    return this.cartService.updateCartItemQuantity(
      HARDCODED_USER_ID,
      cartItemId,
      updateCartItemDto.quantity
    );
  }

  @Delete('items/:id')
  async removeCartItem(@Param('id') cartItemId: string) {
    // In a real app, get userId from auth context
    return this.cartService.removeCartItem(HARDCODED_USER_ID, cartItemId);
  }

  @Delete()
  async clearCart() {
    // In a real app, get userId from auth context
    return this.cartService.clearCart(HARDCODED_USER_ID);
  }
} 