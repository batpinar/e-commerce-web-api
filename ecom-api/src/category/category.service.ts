import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCategoryDto } from 'src/dto/create-category.dto';
import { UpdateCategoryDto } from 'src/dto/update-category.dto';


@Injectable()
export class CategoryService {
    constructor(private readonly prismaService: PrismaService) {}

    async createCategory(dto: CreateCategoryDto) {
        return this.prismaService.category.create({
            data: {
                name: dto.name,
                slug: dto.slug,
                order: dto.order,
            },
        });
    }

    async getAllCategories() {
        return this.prismaService.category.findMany({
            orderBy: {
                order: 'asc',
            },
        });
    }

    async getCategoryById(id: string) {
        return this.prismaService.category.findFirst({
            where: {
                id: id,
            },
        });
    }

    async updateCategory(id: string, dto: UpdateCategoryDto) {
        await this.getCategoryById(id);
        return this.prismaService.category.update({
            where: {
                id: id,
            },
            data:dto,
        });
    }

    async deleteCategory(id: string) {
        await  this.getCategoryById(id)
        return this.prismaService.category.delete({
            where: {
                id: id,
            },
        });
    }
}
