import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { PrismaService } from "../prisma/prisma.service"
import { SignInDto } from "./dto/sign-in.dto"

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateUser({ name, password }: SignInDto): Promise<string> {
    try {
      const user = await this.prismaService.users.findFirst({
        where: {
          name,
        },
      })
      if (!user || user.password !== password) throw new UnauthorizedException()
      const token = this.jwtService.sign({
        id: user.id,
        name: user.name,
      })
      return token
    } catch (error) {
      if (error instanceof UnauthorizedException)
        throw new UnauthorizedException(
          "Tên nhân vật hoặc mật khẩu không chính xác",
        )
      throw new InternalServerErrorException(error?.message)
    }
  }
}
