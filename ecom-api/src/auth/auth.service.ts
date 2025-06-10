import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly mailerService: MailerService,
  ) {}

  private async generateTokens(userId: string, email: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { sub: userId, email },
        { expiresIn: '15m' }
      ),
      this.jwtService.signAsync(
        { sub: userId, email },
        { expiresIn: '7d' }
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

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
      throw new BadRequestException({
        message: 'Email veya kullanıcı adı zaten kullanımda',
        field: existingUser.email === email ? 'email' : 'username'
      });
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

    const tokens = await this.generateTokens(user.id, user.email);

    const { passwordHash, ...result } = user;
    return {
      ...result,
      ...tokens
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException({
        message: 'Geçersiz kimlik bilgileri',
        field: 'email'
      });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException({
        message: 'Geçersiz kimlik bilgileri',
        field: 'password'
      });
    }

    const tokens = await this.generateTokens(user.id, user.email);

    const { passwordHash, ...result } = user;
    return {
      user: result,
      ...tokens
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      const { sub, email } = await this.jwtService.verifyAsync(refreshToken);
      const tokens = await this.generateTokens(sub, email);
      return tokens;
    } catch {
      throw new UnauthorizedException('Geçersiz refresh token');
    }
  }

  async requestPasswordReset(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Güvenlik için kullanıcı bulunamasa bile başarılı mesajı dön
      return { message: 'Şifre sıfırlama bağlantısı gönderildi' };
    }

    const resetToken = uuidv4();
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 saat

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    });

    const resetUrl = `${process.env.FRONTEND_URL}/auth/reset-password?token=${resetToken}`;

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Şifre Sıfırlama',
      template: 'password-reset',
      context: {
        name: user.fullName,
        resetUrl,
      },
    });

    return { message: 'Şifre sıfırlama bağlantısı gönderildi' };
  }

  async resetPassword(token: string, newPassword: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      throw new BadRequestException('Geçersiz veya süresi dolmuş şifre sıfırlama bağlantısı');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    return { message: 'Şifre başarıyla güncellendi' };
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
