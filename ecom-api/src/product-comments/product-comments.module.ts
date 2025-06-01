import { Module } from '@nestjs/common';
import { ProductCommentsService } from './product-comments.service';
import { ProductCommentsController } from './product-comments.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [ProductCommentsService],
  controllers: [ProductCommentsController]
})
export class ProductCommentsModule {}
