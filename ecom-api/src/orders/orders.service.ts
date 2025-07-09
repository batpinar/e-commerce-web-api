import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateOrderDto } from './dto/create-order.dto'

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

    if (!cart || cart.items.length === 0) {
      throw new NotFoundException('Cart is empty or not found')
    }

    // Calculate total price
    const totalPrice = cart.items.reduce((sum, item) => sum + (item.quantity * item.product.price), 0);

    // Create order
    const order = await this.prisma.order.create({
      data: {
        userId,
        status: 'PENDING',
        TotalPrice: totalPrice,
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
        orderItems: {
          create: cart.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.product.price,
          })),
        },
      },
      include: {
        orderItems: {
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
        shippingAddress: true,
      },
    })

    // Clear cart after successful order creation
    await this.prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    })

    return order
  }

  async getOrderById(orderId: string, userId?: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        orderItems: {
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
        shippingAddress: true,
      },
    })

    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`)
    }

    // Check if user has permission to view this order
    if (userId && order.userId !== userId) {
      throw new ForbiddenException('You do not have permission to view this order')
    }

    return order
  }

  async getUserOrders(userId: string) {
    return this.prisma.order.findMany({
      where: { userId },
      include: {
        orderItems: {
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
        shippingAddress: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
  }

  async updateOrderStatus(orderId: string, status: string, userId?: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    })

    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`)
    }

    // Check if user has permission to update this order (for normal users)
    if (userId && order.userId !== userId) {
      throw new ForbiddenException('You do not have permission to update this order')
    }

    return this.prisma.order.update({
      where: { id: orderId },
      data: { status: status as any },
      include: {
        orderItems: {
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
        shippingAddress: true,
      },
    })
  }
} 