import { Controller, Get } from '@nestjs/common';

@Controller('api/brands')
export class BrandsController {
  @Get()
  findAll() {
    return [
      { name: 'Versace' },
      { name: 'Zara' },
      { name: 'Gucci' },
      { name: 'Prada' },
      { name: 'Calvin Klein' },
    ];
  }
} 