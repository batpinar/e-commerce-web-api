import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
    constructor(private readonly prisma: PrismaService) { }

    async create(createProductDto: CreateProductDto) {
        return this.prisma.product.create({
            data: {
                ...createProductDto,
                shortDescription: createProductDto.shortDescription || 'Açıklama yok',
                longDescription: createProductDto.longDescription || 'Detaylı açıklama yok',
            },
        });
    }

    async findAll() {
        return this.prisma.product.findMany({
            include: {
                category: true,
                productPhotos: true,
            },
        });
    }

    async findOne(id: string) {
        const product = await this.prisma.product.findUnique({
            where: { id },
            include: {
                category: true,
                productPhotos: true,
            },
        });

        if (!product) {
            throw new NotFoundException(`Product with ID ${id} not found`);
        }

        return product;
    }

    async update(id: string, updateProductDto: UpdateProductDto) {
        const product = await this.prisma.product.findUnique({
            where: { id },
        });

        if (!product) {
            throw new NotFoundException(`Product with ID ${id} not found`);
        }

        return this.prisma.product.update({
            where: { id },
            data: updateProductDto,
        });
    }
    async remove(id: string) {
        const product = await this.prisma.product.findUnique({
            where: { id },
        });

        if (!product) {
            throw new NotFoundException(`Product with ID ${id} not found`);
        }

        return this.prisma.product.delete({
            where: { id },
        });
    }
}
