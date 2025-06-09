import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from 'src/category/dto/create-category.dto';

@Controller('api/categories')
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) {}

    @Post()
    async create(@Body() dto: CreateCategoryDto) {
        return this.categoryService.createCategory(dto);
    }

    @Get()
    async getAll() {
        return this.categoryService.getAllCategories();
    }

    @Get(':id')
    async getById(@Param('id') id: string) {
          console.log('Gelen id:', id); // bu satır test için
        return this.categoryService.getCategoryById(id);
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Body() dto: CreateCategoryDto) {
        return this.categoryService.updateCategory(id, dto);
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        return this.categoryService.deleteCategory(id);
    }
}
