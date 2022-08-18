import { Controller, Get, Param, Query, Req } from "@nestjs/common"
import { RequestWithUser } from "src/interfaces"
import { GetUsersDto } from "./dto"
import { UsersService } from "./users.service"

@Controller("users")
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  async getUsers(@Query() query: GetUsersDto) {
    const paginateUsers = await this.usersService.getAll(query)
    return paginateUsers
  }

  @Get("profile")
  getUser(@Req() req: RequestWithUser) {
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
  async getUserProfile(@Param("name") name: string) {
    const user = await this.usersService.getProfile(name)
    return user
  }

  @Get("profile/:name/properties")
  async getUserProperties(@Param("name") name: string) {
    const properties = await this.usersService.getProperties(name)
    return properties
  }
}
