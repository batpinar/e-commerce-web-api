import { Controller, Post, Get, Body, Param, UsePipes, ValidationPipe, Patch, UseGuards, Request } from '@nestjs/common'
import { OrdersService } from './orders.service'
import { CreateOrderDto } from './dto/create-order.dto'
import { UpdateOrderStatusDto } from './dto/update-order-status.dto'
import { JwtAuthGuard } from '../guards/jwt-auth.guard'

@Controller('api/orders')
@UseGuards(JwtAuthGuard)
@UsePipes(new ValidationPipe())
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async createOrder(@Request() req, @Body() createOrderDto: CreateOrderDto) {
    const userId = req.user.id;
    return this.ordersService.createOrder(userId, createOrderDto)
  }

  @Get()
  async getUserOrders(@Request() req) {
    const userId = req.user.id;
    return this.ordersService.getUserOrders(userId)
  }

  @Get(':id')
  async getOrderById(@Request() req, @Param('id') id: string) {
    const userId = req.user.id;
    return this.ordersService.getOrderById(id, userId)
  }

  @Patch(':id')
  async updateOrderStatus(@Request() req, @Param('id') id: string, @Body() updateOrderStatusDto: UpdateOrderStatusDto) {
    const userId = req.user.id;
    return this.ordersService.updateOrderStatus(id, updateOrderStatusDto.status, userId)
  }
} 