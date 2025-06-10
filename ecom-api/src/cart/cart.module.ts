import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller'; // This controller will be created next
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {} 