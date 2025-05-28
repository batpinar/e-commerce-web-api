import { Controller, Get, Post, Param, Patch, Body, ParseUUIDPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResponseDto } from 'src/dto/user-response.dto';
import { UpdateUserDto } from 'src/dto/update-user.dto';


@Controller('api/users')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Get()
    async findAll(): Promise<UserResponseDto[]> {
        return this.userService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<UserResponseDto> {
        return this.userService.findOne(id);
    }

    @Patch(':id')
    async update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() dto: UpdateUserDto
    ): Promise<UserResponseDto> {
        return this.userService.update(id, dto);
    }
}
