import { IsString, IsOptional } from 'class-validator'

export class CreateOrderDto {
  @IsString()
  fullName: string

  @IsString()
  phone: string

  @IsString()
  address: string

  @IsString()
  city: string

  @IsString()
  state: string

  @IsString()
  zipCode: string

  @IsString()
  country: string

  @IsString()
  @IsOptional()
  notes?: string
} 