
import { IsBoolean, IsInt, IsOptional, Min } from 'class-validator';

export class UpdateProductPhotoDto {
  @IsInt()
  @Min(1)
  @IsOptional()
  order?: number;

  @IsBoolean()
  @IsOptional()
  isPrimary?: boolean;
}
