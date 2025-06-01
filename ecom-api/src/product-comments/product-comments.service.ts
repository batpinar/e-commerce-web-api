import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { NotFoundException } from '@nestjs/common/exceptions/not-found.exception';

@Injectable()
export class ProductCommentsService {
    constructor(private readonly prisma: PrismaService) { }

    async create(createCommentDto: CreateCommentDto) {
        return this.prisma.productComment.create({
            data: {
                userId: createCommentDto.userId,
                productId: createCommentDto.productId,
                title: createCommentDto.title,
                content: createCommentDto.content,
                rating: createCommentDto.rating
            },
        });
    }

    async findAll(productId?: string, rating?: number | string) {
        return this.prisma.productComment.findMany({
            where: {
                ...(productId && { productId }),
                ...(rating !== undefined && { rating: Number(rating) }),
            },
        });
    }

    async findOne(id: string) {
        const comment = await this.prisma.productComment.findUnique({ where: { id } });
        if (!comment) throw new NotFoundException('Yorum bulunamadı');
        return comment;
    }

    async update(id: string, UpdateCommentDto: UpdateCommentDto) {
        return this.prisma.productComment.update({
            where: { id },
            data: {
                title: UpdateCommentDto.title,
                content: UpdateCommentDto.content,
                rating: UpdateCommentDto.rating,
            },
        });
    }

    async remove(id: string) {
        return this.prisma.productComment.delete({
            where: { id },
        });
    }
}
