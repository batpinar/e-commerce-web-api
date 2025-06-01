import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { CategoryModule } from './category/category.module';
import { ProductsModule } from './products/products.module';
import { ProductPhotosModule } from './product-photos/product-photos.module';
import { ProductCommentsModule } from './product-comments/product-comments.module';

@Module({
  imports: [AuthModule, PrismaModule, UserModule, CategoryModule, ProductsModule, ProductPhotosModule, ProductCommentsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
