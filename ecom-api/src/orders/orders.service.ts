import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateOrderDto } from './dto/create-order.dto'
import { PaymentMethod } from './dto/create-order.dto'

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async createOrder(userId: string, createOrderDto: CreateOrderDto) {
    // Get user's cart
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    })

    if (!cart) {
      throw new NotFoundException('Cart not found')
    }

    // Create order
    const order = await this.prisma.order.create({
      data: {
        userId,
        status: 'PENDING',
        paymentMethod: createOrderDto.paymentMethod,
        shippingAddress: {
          create: {
            fullName: createOrderDto.fullName,
            phone: createOrderDto.phone,
            address: createOrderDto.address,
            city: createOrderDto.city,
            state: createOrderDto.state,
            zipCode: createOrderDto.zipCode,
            country: createOrderDto.country,
          },
        },
        items: {
          create: cart.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
          })),
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        shippingAddress: true,
      },
    })

    // Clear cart after successful order creation
    await this.prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    })

    return order
  }

  async getOrderById(orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        shippingAddress: true,
      },
    })

    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`)
    }

    return order
  }

  async getUserOrders(userId: string) {
    return this.prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        shippingAddress: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
  }

  async updateOrderStatus(orderId: string, status: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    })

    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`)
    }

    return this.prisma.order.update({
      where: { id: orderId },
      data: { status },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        shippingAddress: true,
      },
    })
  }
} 