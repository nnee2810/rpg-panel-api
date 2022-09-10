import {
  Body,
  Controller,
  HttpException,
  InternalServerErrorException,
  Post,
  UnauthorizedException,
} from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { PrismaService } from "../prisma/prisma.service"
import { PublicRoute } from "./decorators"
import { SignInDto } from "./dto"

@Controller("auth")
export class AuthController {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  @PublicRoute()
  @Post("sign-in")
  async signIn(@Body() data: SignInDto) {
    try {
      const user = await this.prismaService.users.findFirst({
        where: {
          name: data.name,
        },
      })
      if (!user || user.password !== data.password)
        throw new UnauthorizedException(
          "Tên nhân vật hoặc mật khẩu không chính xác",
        )
      return this.jwtService.sign({
        id: user.id,
        name: user.name,
      })
    } catch (error) {
      if (error instanceof HttpException)
        throw new HttpException(error.message, error.getStatus())
      throw new InternalServerErrorException(error?.message)
    }
  }
}
