import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
  Req,
} from "@nestjs/common"
import { RequestWithUser } from "src/interfaces"
import { GetUsersDto } from "./dto"
import { UsersService } from "./users.service"

@Controller("users")
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  async getUsers(@Query() query: GetUsersDto) {
    const paginateUsers = await this.usersService.findAll(query)
    return paginateUsers
  }

  @Get("profile")
  getProfile(@Req() req: RequestWithUser) {
    const {
      id,
      name,
      Level,
      Respect,
      Admin,
      Helper,
      Leader,
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
      Leader,
      Status,
      Banned,
      BReason,
      PremiumPoints,
    }
  }

  @Get("profile/:name")
  async getUserByName(@Param("name") name: string) {
    const user = await this.usersService.findByName(name)
    if (!user) throw new NotFoundException("Người chơi không tồn tại")
    return user
  }
}
