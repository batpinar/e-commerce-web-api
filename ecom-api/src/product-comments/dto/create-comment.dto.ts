import { IsUUID, IsOptional, IsString, MaxLength, IsInt, Min, Max, ValidateIf } from "class-validator";

export class CreateCommentDto {
    @IsUUID()
    productId: string;

    @IsUUID()
    userId: string;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    title?: string;

    @IsString()
    @ValidateIf(o => !o.title !== null) // title yoksa content zorunlu
    content: string;

    @IsInt()
    @Min(1)
    @Max(5)
    rating: number;
}