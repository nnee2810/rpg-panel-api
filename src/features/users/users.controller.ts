import { Controller, Get, Req } from "@nestjs/common"
import { RequestWithUser } from "src/interfaces"
import { UsersService } from "./users.service"

@Controller("users")
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get("profile")
  getProfile(@Req() req: RequestWithUser) {
    const {
      id,
      name,
      Admin,
      Helper,
      Status,
      Banned,
      BReason,
      Model,
      Vip,
      Premium,
    } = req.user
    return {
      id,
      name,
      Admin,
      Helper,
      Status,
      Banned,
      BReason,
      Model,
      Vip,
      Premium,
    }
  }
}
