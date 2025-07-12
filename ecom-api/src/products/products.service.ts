import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Prisma, Product } from '@prisma/client';

interface FindAllOptions {
    skip?: number;
    take?: number;
    category?: string;
    categoryId?: string;
    sort?: string;
    search?: string;
    inStock?: boolean;
    minPrice?: number;
    maxPrice?: number;
    minRating?: number;
    maxRating?: number;
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
    stockQuantity: number;
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
        const { 
            skip = 0, 
            take = 20, 
            category, 
            categoryId,
            sort, 
            search, 
            inStock, 
            minPrice, 
            maxPrice, 
            minRating,
            maxRating
        } = options;

        const where: Prisma.ProductWhereInput = {
            AND: [
                // Kategori slug ile filtreleme
                category ? {
                    category: {
                        slug: category,
                    },
                } : {},
                // Kategori ID ile filtreleme
                categoryId ? {
                    categoryId: categoryId,
                } : {},
                // Arama
                search ? {
                    OR: [
                        { name: { contains: search, mode: 'insensitive' } },
                        { shortDescription: { contains: search, mode: 'insensitive' } },
                        { longDescription: { contains: search, mode: 'insensitive' } },
                    ],
                } : {},
                // Stok filtresi
                inStock !== undefined ? {
                    stockQuantity: inStock ? {
                        gt: 0,
                    } : {
                        lte: 0,
                    }
                } : {},
                // Minimum fiyat
                minPrice ? {
                    price: {
                        gte: minPrice,
                    },
                } : {},
                // Maksimum fiyat
                maxPrice ? {
                    price: {
                        lte: maxPrice,
                    },
                } : {},
                // Minimum rating
                minRating ? {
                    averageRating: {
                        gte: minRating,
                    },
                } : {},
                // Maksimum rating
                maxRating ? {
                    averageRating: {
                        lte: maxRating,
                    },
                } : {},
            ],
        };

        // Gelişmiş sıralama sistemi
        const orderBy: Prisma.ProductOrderByWithRelationInput = this.parseSort(sort);
        
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
                        take: 1,
                    },
                },
            }),
            this.prisma.product.count({ where }),
        ]);

        return [products, total];
    }

    private parseSort(sort?: string): Prisma.ProductOrderByWithRelationInput {
        if (!sort) return { createdAt: 'desc' }; // Varsayılan: En yeni ürünler

        const sortOptions = sort.split(','); // Birden fazla sıralama kriteri destekle
        const orderBy: Prisma.ProductOrderByWithRelationInput = {};

        for (const option of sortOptions) {
            const [field, direction] = option.split(':');
            const dir = direction?.toLowerCase() === 'desc' ? 'desc' : 'asc';

            switch (field) {
                case 'price':
                    orderBy.price = dir;
                    break;
                case 'rating':
                    orderBy.averageRating = dir;
                    break;
                case 'name':
                    orderBy.name = dir;
                    break;
                case 'created':
                case 'date':
                    orderBy.createdAt = dir;
                    break;
                case 'stock':
                    orderBy.stockQuantity = dir;
                    break;
                case 'comments':
                    orderBy.commentCount = dir;
                    break;
                default:
                    // Varsayılan sıralama seçenekleri
                    if (option === 'price_asc') orderBy.price = 'asc';
                    else if (option === 'price_desc') orderBy.price = 'desc';
                    else if (option === 'rating_desc') orderBy.averageRating = 'desc';
                    else if (option === 'rating_asc') orderBy.averageRating = 'asc';
                    else if (option === 'newest') orderBy.createdAt = 'desc';
                    else if (option === 'oldest') orderBy.createdAt = 'asc';
                    else if (option === 'name_asc') orderBy.name = 'asc';
                    else if (option === 'name_desc') orderBy.name = 'desc';
                    else if (option === 'popular') orderBy.commentCount = 'desc';
                    break;
            }
        }

        return Object.keys(orderBy).length > 0 ? orderBy : { createdAt: 'desc' };
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
