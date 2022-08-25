import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common"
import { AuthService } from "./auth.service"
import { PublicRoute } from "./decorators"
import { SignInDto } from "./dto"

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @PublicRoute()
  @HttpCode(HttpStatus.OK)
  @Post("sign-in")
  async signIn(@Body() data: SignInDto) {
    const token = this.authService.validateUser(data)
    return token
  }
}
