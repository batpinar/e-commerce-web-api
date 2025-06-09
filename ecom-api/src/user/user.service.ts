import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserResponseDto } from 'src/user/dto/user-response.dto';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';

@Injectable()
export class UserService {
    constructor(private readonly prismaService: PrismaService) { }

    async findAll(): Promise<UserResponseDto[]> {
        const users = await this.prismaService.user.findMany();
        return users.map((user) => this.toResponseDto(user));
    }

    async findOne(id: string): Promise<UserResponseDto> {
        const user = await this.prismaService.user.findUnique({ where: { id } });
        if (!user) throw new NotFoundException(`User with id ${id} not found`);
        return this.toResponseDto(user);
    }

    async update(id: string, dto: UpdateUserDto): Promise<UserResponseDto> {
        const user = await this.prismaService.user.findUnique({ where: { id } });
        if (!user) {
            throw new NotFoundException(`User with id ${id} not found`);
        }

        const updated = await this.prismaService.user.update({
            where: { id },
            data: {
                ...dto,
                fullName: dto.firstName && dto.lastName
                    ? `${dto.firstName} ${dto.lastName}`
                    : user.fullName,
            },
        });

        return this.toResponseDto(updated);
    }

    private toResponseDto(user: any): UserResponseDto {
        const { id, firstName, lastName, username, email, createdAt, updatedAt } = user;
        return {
            Id: id,
            firstName,
            lastName,
            fullName: `${firstName} ${lastName}`,
            username,
            email,
            createdAt,
            updatedAt,
        };
    }
}
