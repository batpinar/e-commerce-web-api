import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  // AuthGuard'dan miras alır ve JWT doğrulamasını sağlar
  // Ekstra işlevsellik eklemek isterseniz burada yapabilirsiniz
}