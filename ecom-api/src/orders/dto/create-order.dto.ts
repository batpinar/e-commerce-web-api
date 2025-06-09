import { IsString, IsNumber, IsArray, ValidateNested, IsEnum } from 'class-validator'
import { Type } from 'class-transformer'

export enum PaymentMethod {
  CREDIT_CARD = 'CREDIT_CARD',
  BANK_TRANSFER = 'BANK_TRANSFER',
}

export class OrderItemDto {
  @IsString()
  productId: string

  @IsNumber()
  quantity: number

  @IsNumber()
  price: number
}

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

  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[]
} 