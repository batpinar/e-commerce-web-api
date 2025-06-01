import { Controller, Get, Post, Patch, Delete, Param, Body } from '@nestjs/common';
import { ProductPhotosService } from './product-photos.service';
import { CreateProductPhotoDto } from './dto/create-product-photo.dto';
import { UpdateProductPhotoDto } from './dto/update-product-photo.dto';
import { NotFoundException } from '@nestjs/common/exceptions/not-found.exception';

@Controller('api/product-photos')
export class ProductPhotosController {
    constructor(private readonly productPhotosService: ProductPhotosService) { }

    @Post()
    async create(@Body() createDto: CreateProductPhotoDto) {
        return this.productPhotosService.create(createDto);
    }
    @Patch(':id')
    async update(@Param('id') id: string, @Body() updateDto: UpdateProductPhotoDto) {
        return this.productPhotosService.update(id, updateDto);
    }
    @Delete(':id')
    async remove(@Param('id') id: string) {
        return this.productPhotosService.remove(id);
    }
}
