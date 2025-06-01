import { IsString, IsBoolean, IsOptional, IsInt, Min, IsUUID } from 'class-validator';

export class CreateProductPhotoDto {
  @IsUUID()
  productId: string;

  @IsString()
  url: string;

  @IsInt()
  @Min(1)
  size: number;

  @IsBoolean()
  @IsOptional()
  isPrimary?: boolean;
}
