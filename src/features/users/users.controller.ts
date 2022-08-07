import { Controller, Get, Req } from "@nestjs/common"
import { RequestWithUser } from "src/interfaces"
import { UsersService } from "./users.service"

@Controller("users")
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get("get-profile")
  getProfile(@Req() req: RequestWithUser) {
    const {
      id,
      name,
      Level,
      Respect,
      Admin,
      Helper,
      Status,
      Banned,
      BReason,
      PremiumPoints,
    } = req.user
    return {
      id,
      name,
      Level,
      Respect,
      Admin,
      Helper,
      Status,
      Banned,
      BReason,
      PremiumPoints,
    }
  }
}
