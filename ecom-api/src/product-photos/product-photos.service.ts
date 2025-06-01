import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductPhotoDto } from './dto/create-product-photo.dto';
import { UpdateProductPhotoDto } from './dto/update-product-photo.dto';
import { NotFoundException } from '@nestjs/common/exceptions/not-found.exception';

@Injectable()
export class ProductPhotosService {
    constructor(private readonly prisma: PrismaService) { }
    async create(createDto: CreateProductPhotoDto) {
        const { productId, url, size, isPrimary } = createDto;

        const product = await this.prisma.product.findUnique({ where: { id: productId } });
        if (!product) {
            throw new Error(`Product with ID ${productId} not found`);
        }

        const lastPhoto = await this.prisma.productPhoto.findFirst({
            where: { productId },
            orderBy: { order: 'desc' },
        });

        const nextOrder = lastPhoto ? lastPhoto.order + 1 : 1;

        if (isPrimary) {
            await this.prisma.productPhoto.updateMany({
                where: { productId, isPrimary: true },
                data: { isPrimary: false },
            })
        }
        return this.prisma.productPhoto.create({
            data: {
                productId,
                url,
                size,
                isPrimary,
                order: nextOrder,
            }
        });
    }

    async findOne(id: string) {
        const photo = await this.prisma.productPhoto.findUnique({ where: { id } });
        if (!photo) throw new NotFoundException('Photo not found');
        return photo;
    }

    async update(id: string, updateDto: UpdateProductPhotoDto) {
        const photo = await this.findOne(id)
        const { order, isPrimary } = updateDto;

        // Eğer order belirtilmişse ve mevcut fotoğrafın sırası farklıysa
        if (order !== undefined && order !== photo.order) {
            const existingPhoto = await this.prisma.productPhoto.findUnique({ where: { id } });
            await this.reorderPhotos(photo.productId, photo.order, order);
        }
        // Eğer isPrimary belirtilmişse ve mevcut fotoğrafın isPrimary değeri farklıysa
        if (isPrimary !== undefined && isPrimary !== photo.isPrimary && isPrimary === true) {
            // Yeni fotoğrafı birincil yaparken diğerlerini pasifleştir
            await this.prisma.productPhoto.updateMany({
                where: { productId: photo.productId, isPrimary: true },
                data: { isPrimary: false },
            });
        }

        if (isPrimary === false && photo.isPrimary === true) {
            const nextPhoto = await this.prisma.productPhoto.findFirst({
                where: {
                    productId: photo.productId,
                    NOT: { id: photo.id },
                },
                orderBy: { order: 'asc' },
            });

            if (nextPhoto) {
                await this.prisma.productPhoto.update({
                    where: { id: nextPhoto.id },
                    data: { isPrimary: true },
                });
            } else {
                throw new BadRequestException('at least one photo must be primary');
            }
        }
        return this.prisma.productPhoto.update({
            where: { id },
            data: {
                ...updateDto,
                isPrimary: isPrimary !== undefined ? isPrimary : photo.isPrimary,
            },
        });
    }

    async remove(id: string) {
        const photo = await this.findOne(id);
        const isPrimary = photo.isPrimary;

        await this.prisma.productPhoto.delete({ where: { id } });

        // Eğer silinen fotoğraf birincil fotoğraf ise, yeni birincil fotoğraf ataması yap
        if (isPrimary) {
            const newPrimaryPhoto = await this.prisma.productPhoto.findFirst({
                where: { productId: photo.productId, isPrimary: false },
                orderBy: { order: 'asc' },
            });

            if (newPrimaryPhoto) {
                await this.prisma.productPhoto.update({
                    where: { id: newPrimaryPhoto.id },
                    data: { isPrimary: true },
                });
            }
        }

        await this.shiftOrderAfterDeletion(photo.productId, photo.order);

        return { message: 'Photo deleted successfully' };

    }

    private async reorderPhotos(productId: string, oldOrder: number, newOrder: number) {
        if (oldOrder === newOrder) return;

        if (newOrder < oldOrder) {
            // Sırası ileri çekildiğinde aradakileri kaydır
            await this.prisma.productPhoto.updateMany({
                where: {
                    productId,
                    order: { gte: newOrder, lt: oldOrder },
                },
                data: { order: { increment: 1 } },
            });
        } else {
            // Sırası geri çekildiğinde aradakileri kaydır
            await this.prisma.productPhoto.updateMany({
                where: {
                    productId,
                    order: { gt: oldOrder, lte: newOrder },
                },
                data: { order: { decrement: 1 } },
            });
        }
    }

    private async shiftOrderAfterDeletion(productId: string, deletedOrder: number) {
        // Silinen fotoğrafın sırasından sonraki tüm fotoğrafların sırasını bir azalt
        await this.prisma.productPhoto.updateMany({
            where: {
                productId,
                order: { gt: deletedOrder },
            },
            data: { order: { decrement: 1 } },
        });
    }
}
