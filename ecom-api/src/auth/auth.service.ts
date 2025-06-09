import { Injectable, UnauthorizedException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { firstName, lastName, username, email, password } = registerDto;
    
    // Email ve username kontrolü
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { username }
        ]
      }
    });

    if (existingUser) {
      throw new UnauthorizedException('Email veya kullanıcı adı zaten kullanımda');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const fullName = `${firstName} ${lastName}`;

    const user = await this.prisma.user.create({
      data: {
        firstName,
        lastName,
        username,
        email,
        passwordHash: hashedPassword,
        fullName,
      },
    });

    const { passwordHash, ...result } = user;
    return result;
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Geçersiz kimlik bilgileri');
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Geçersiz kimlik bilgileri');
    }

    const payload = { email: user.email, sub: user.id };
    const accessToken = this.jwtService.sign(payload);

    const { passwordHash, ...result } = user;
    return {
      accessToken,
      user: result
    };
  }

  async validateUser(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new UnauthorizedException('Kullanıcı bulunamadı');
    }

    const { passwordHash, ...result } = user;
    return result;
  }

  logout(userId: string) {
    // JWT tabanlı authentication'da sunucu tarafında logout işlemi yok
    // Client tarafında token'ı silmek yeterli
    return { message: 'Oturum başarıyla kapatıldı' };
  }

  logoutAll(userId: string) {
    // JWT tabanlı authentication'da sunucu tarafında logout işlemi yok
    // Client tarafında token'ı silmek yeterli
    return { message: 'Tüm oturumlar başarıyla kapatıldı' };
  }
}
