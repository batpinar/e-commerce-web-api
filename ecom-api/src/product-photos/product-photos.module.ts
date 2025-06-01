import { Module } from '@nestjs/common';
import { ProductPhotosService } from './product-photos.service';
import { ProductPhotosController } from './product-photos.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [ProductPhotosService, PrismaService],
  controllers: [ProductPhotosController]
})
export class ProductPhotosModule {}
