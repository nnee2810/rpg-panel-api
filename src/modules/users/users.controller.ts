import {
  Controller,
  Get,
  HttpException,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Query,
  Req,
} from "@nestjs/common"
import { bizz, cars, houses, users } from "@prisma/client"
import { PaginationData, RequestWithUser } from "src/interfaces"
import { GetUsersDto } from "./dto"
import { UsersService } from "./users.service"

@Controller("users")
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  async getUsers(
    @Query() query: GetUsersDto,
  ): Promise<PaginationData<Partial<users>>> {
    try {
      return await this.usersService.getAll(query)
    } catch (error) {
      throw new InternalServerErrorException(error?.message)
    }
  }

  @Get("profile")
  getUser(@Req() req: RequestWithUser): Partial<users> {
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

  @Get(":name")
  async getUserProfile(@Param("name") name: string) {
    try {
      const user = await this.usersService.getProfileByName(name)
      if (!user) throw new NotFoundException("Không tìm thấy người chơi")
      return user
    } catch (error) {
      if (error instanceof HttpException)
        throw new HttpException(error.message, error.getStatus())
      throw new InternalServerErrorException(error?.message)
    }
  }

  @Get(":name/properties")
  async getUserProperties(@Param("name") name: string): Promise<{
    vehicles: cars[]
    house: Partial<houses>
    bizz: bizz
  }> {
    try {
      return await this.usersService.getPropertiesByName(name)
    } catch (error) {
      throw new InternalServerErrorException(error?.message)
    }
  }
}
