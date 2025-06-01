import { Controller, Get, Post, Patch, Delete, Body, Param, Query, ParseIntPipe } from '@nestjs/common';
import { ProductCommentsService } from './product-comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller('api/product-comments')
export class ProductCommentsController {
    constructor(private readonly productCommentsService: ProductCommentsService) {
        // Constructor logic can be added here if needed
    }

    @Post()
    create(@Body() createCommentDto: CreateCommentDto) {
        return this.productCommentsService.create(createCommentDto);
    }

    @Get()
    findAll(
        @Query('productId') productId?: string,
        @Query('rating', new ParseIntPipe({ optional: true })) rating?: number,
    ) {
        return this.productCommentsService.findAll(productId, rating);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.productCommentsService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto) {
        return this.productCommentsService.update(id, updateCommentDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.productCommentsService.remove(id);
    }
}
