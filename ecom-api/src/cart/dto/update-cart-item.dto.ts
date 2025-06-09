import { IsString, IsNumber, IsOptional, Min, Max } from 'class-validator';

export class UpdateCartItemDto {
  @IsNumber()
  @Min(1)
  @Max(10)
  quantity: number;

  @IsString()
  @IsOptional()
  note?: string;
} 