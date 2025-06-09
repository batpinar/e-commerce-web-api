import { Controller, Post, Body } from '@nestjs/common';

@Controller('api/newsletter')
export class NewsletterController {
  @Post()
  subscribe(@Body('email') email: string) {
    // Burada emaili kaydedebilirsiniz (şimdilik sadece döndürüyoruz)
    return { success: true, email };
  }
} 