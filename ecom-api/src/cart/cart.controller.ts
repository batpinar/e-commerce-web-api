import { Controller, Get, Post, Body, Param, UsePipes, ValidationPipe, Patch, Delete, UseGuards, Request } from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('api/cart-items')
@UseGuards(JwtAuthGuard)
@UsePipes(new ValidationPipe())
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  async getCart(@Request() req) {
    const userId = req.user.id;
    return this.cartService.getCartByUserId(userId);
  }

  @Post()
  async addItemToCart(@Request() req, @Body() addToCartDto: AddToCartDto) {
    const userId = req.user.id;
    return this.cartService.addItemToCart(
      userId,
      addToCartDto.productId,
      addToCartDto.quantity
    );
  }

  @Patch(':id')
  async updateCartItemQuantity(
    @Request() req,
    @Param('id') cartItemId: string,
    @Body() updateCartItemDto: UpdateCartItemDto
  ) {
    const userId = req.user.id;
    return this.cartService.updateCartItemQuantity(
      userId,
      cartItemId,
      updateCartItemDto.quantity
    );
  }

  @Delete(':id')
  async removeCartItem(@Request() req, @Param('id') cartItemId: string) {
    const userId = req.user.id;
    return this.cartService.removeCartItem(userId, cartItemId);
  }

  @Delete()
  async clearCart(@Request() req) {
    const userId = req.user.id;
    return this.cartService.clearCart(userId);
  }
} 