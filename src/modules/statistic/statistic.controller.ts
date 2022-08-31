import { Controller, Get, InternalServerErrorException } from "@nestjs/common"
import { users } from "@prisma/client"
import { StatisticService } from "./statistic.service"

@Controller("statistic")
export class StatisticController {
  constructor(private statisticService: StatisticService) {}

  @Get("overview")
  async getOverview() {
    try {
      const overview = await this.statisticService.getOverview()
      return overview
    } catch (error) {
      throw new InternalServerErrorException(error?.message)
    }
  }

  @Get("top-level")
  async getTopLevel(): Promise<Partial<users>[]> {
    try {
      const users = await this.statisticService.getTopLevel()
      return users
    } catch (error) {
      throw new InternalServerErrorException(error?.message)
    }
  }

  @Get("top-rich")
  async getTopRich(): Promise<Partial<users>[]> {
    try {
      const users = await this.statisticService.getTopRich()
      return users
    } catch (error) {
      throw new InternalServerErrorException(error?.message)
    }
  }

  @Get("top-connected-time")
  async getTopConnectedTime(): Promise<Partial<users>[]> {
    try {
      const users = await this.statisticService.getTopConnectedTime()
      return users
    } catch (error) {
      throw new InternalServerErrorException(error?.message)
    }
  }
}
