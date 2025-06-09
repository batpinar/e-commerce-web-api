import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Prisma, Product } from '@prisma/client';

interface FindAllOptions {
    skip?: number;
    take?: number;
    category?: string;
    sort?: string;
    search?: string;
}

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

    async findAll(options: FindAllOptions = {}): Promise<[ProductWithRelations[], number]> {
        const { skip = 0, take = 20, category, sort, search } = options;

        const where: Prisma.ProductWhereInput = {
            AND: [
                category ? {
                    category: {
                        slug: category,
                    },
                } : {},
                search ? {
                    OR: [
                        { name: { contains: search, mode: 'insensitive' } },
                        { shortDescription: { contains: search, mode: 'insensitive' } },
                        { longDescription: { contains: search, mode: 'insensitive' } },
                    ],
                } : {},
            ],
        };

        const orderBy: Prisma.ProductOrderByWithRelationInput = sort ? {
            ...(sort === 'price_asc' && { price: 'asc' }),
            ...(sort === 'price_desc' && { price: 'desc' }),
            ...(sort === 'newest' && { createdAt: 'desc' }),
            ...(sort === 'rating' && { averageRating: 'desc' }),
        } : { createdAt: 'desc' };

        const [products, total] = await Promise.all([
            this.prisma.product.findMany({
                where,
                orderBy,
                skip,
                take,
                include: {
                    category: {
                        select: {
                            id: true,
                            name: true,
                            slug: true,
                        },
                    },
                    productPhotos: {
                        where: {
                            isPrimary: true,
                        },
                        select: {
                            url: true,
                        },
                    },
                },
            }),
            this.prisma.product.count({ where }),
        ]);

        return [products, total];
    }

    async findOne(slug: string) {
        return this.prisma.product.findUnique({
            where: { slug },
            include: {
                category: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                    },
                },
                productPhotos: {
                    orderBy: {
                        order: 'asc',
                    },
                },
                productComments: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                fullName: true,
                            },
                        },
                    },
                    orderBy: {
                        createdAt: 'desc',
                    },
                },
            },
        });
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
