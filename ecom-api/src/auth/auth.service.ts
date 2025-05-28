import { Injectable, UnauthorizedException } from '@nestjs/common';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private users = new Map(); // Geçici kullanıcı deposu (veritabanı yerine)

  constructor(private readonly jwtService: JwtService) {}

  async register(registerDto: RegisterDto) {
    const { email, password } = registerDto;
    const hashedPassword = await bcrypt.hash(password, 10);
    this.users.set(email, { email, password: hashedPassword });
    return { message: 'Kayıt başarılı' };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = this.users.get(email);

    if (!user) {
      throw new UnauthorizedException('Geçersiz kimlik bilgileri');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Geçersiz kimlik bilgileri');
    }

    const payload = { email, sub: email };
    const accessToken = this.jwtService.sign(payload);

    return { accessToken };
  }

  logout(userId: string) {
    // Token invalidation mantığı burada uygulanabilir
    return { message: `Oturum kapatıldı: ${userId}` };
  }

  logoutAll(userId: string) {
    // Tüm oturumları iptal etme (örneğin, refresh token'ları silme)
    return { message: `Tüm oturumlar kapatıldı: ${userId}` };
  }
}
