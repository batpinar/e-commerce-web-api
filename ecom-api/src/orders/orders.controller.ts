import { Controller, Post, Get, Body, Param, UsePipes, ValidationPipe, Patch } from '@nestjs/common'
import { OrdersService } from './orders.service'
import { CreateOrderDto } from './dto/create-order.dto'

// TODO: Replace with actual user ID from authentication
const HARDCODED_USER_ID = 'user-123'

@Controller('orders')
@UsePipes(new ValidationPipe())
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async createOrder(@Body() createOrderDto: CreateOrderDto) {
    // In a real app, get userId from auth context
    return this.ordersService.createOrder(HARDCODED_USER_ID, createOrderDto)
  }

  @Get()
  async getUserOrders() {
    // In a real app, get userId from auth context
    return this.ordersService.getUserOrders(HARDCODED_USER_ID)
  }

  @Get(':id')
  async getOrderById(@Param('id') id: string) {
    return this.ordersService.getOrderById(id)
  }

  @Patch(':id/status')
  async updateOrderStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.ordersService.updateOrderStatus(id, status)
  }
} 