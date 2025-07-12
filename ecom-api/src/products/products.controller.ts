import { Controller, Post, Body, Get, Param, Patch, Delete, Query, HttpException, HttpStatus } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from '@prisma/client';

type ProductWithRelations = Product & {
    category: {
        id: string;
        name: string;
        slug: string;
    };
    productPhotos: {
        url: string;
    }[];
};

@Controller('api/products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) { }

    @Post()
    async create(@Body() CreateProductDto : CreateProductDto) {
        return this.productsService.create(CreateProductDto);
    }

    @Get()
    async findAll(
        @Query('page') page = '1',
        @Query('limit') limit = '20',
        @Query('category') category?: string,
        @Query('category_id') categoryId?: string,
        @Query('sort') sort?: string,
        @Query('search') search?: string,
        @Query('in_stock') inStock?: string,
        @Query('min_price') minPrice?: string,
        @Query('max_price') maxPrice?: string,
        @Query('min_rating') minRating?: string,
        @Query('max_rating') maxRating?: string,
    ) {
        try {
            const pageNumber = parseInt(page, 10);
            const limitNumber = parseInt(limit, 10);

            if (isNaN(pageNumber) || pageNumber < 1) {
                throw new HttpException('Invalid page number', HttpStatus.BAD_REQUEST);
            }

            if (isNaN(limitNumber) || limitNumber < 1) {
                throw new HttpException('Invalid limit number', HttpStatus.BAD_REQUEST);
            }

            const skip = (pageNumber - 1) * limitNumber;

            // Parse filter parameters
            const filters = {
                skip,
                take: limitNumber,
                category,
                categoryId,
                sort,
                search,
                inStock: inStock !== undefined ? inStock === 'true' : undefined,
                minPrice: minPrice ? parseFloat(minPrice) : undefined,
                maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
                minRating: minRating ? parseFloat(minRating) : undefined,
                maxRating: maxRating ? parseFloat(maxRating) : undefined,
            };

            const [products, total] = await this.productsService.findAll(filters);

            return {
                products,
                total,
                hasMore: skip + products.length < total,
                currentPage: pageNumber,
                totalPages: Math.ceil(total / limitNumber),
            };
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException(
                'An error occurred while fetching products',
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @Get(':slug')
    async findOne(@Param('slug') slug: string) {
        return this.productsService.findOne(slug);
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
        return this.productsService.update(id, updateProductDto);
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        return this.productsService.remove(id);
    }
}
