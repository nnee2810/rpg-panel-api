import { Controller, Get, InternalServerErrorException } from "@nestjs/common"
import { users } from "@prisma/client"
import { StatisticService } from "./statistic.service"

@Controller("statistic")
export class StatisticController {
  constructor(private statisticService: StatisticService) {}

  @Get("server")
  async getServerStatistic() {
    try {
      const data = await this.statisticService.getServer()
      return data
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

  @Get("tickets")
  async getTicketsStatistic() {
    try {
      const data = await this.statisticService.getTickets()
      return data
    } catch (error) {
      throw new InternalServerErrorException(error?.message)
    }
  }
}
