import { Controller, Get, InternalServerErrorException } from "@nestjs/common"
import { users } from "@prisma/client"
import { StatisticService } from "./statistic.service"

@Controller("statistic")
export class StatisticController {
  constructor(private statisticService: StatisticService) {}

  @Get("server")
  async getServerStatistic() {
    try {
      return await this.statisticService.getServer()
    } catch (error) {
      throw new InternalServerErrorException(error?.message)
    }
  }

  @Get("top-level")
  async getTopLevel(): Promise<Partial<users>[]> {
    try {
      return await this.statisticService.getTopLevel()
    } catch (error) {
      throw new InternalServerErrorException(error?.message)
    }
  }

  @Get("top-rich")
  async getTopRich(): Promise<Partial<users>[]> {
    try {
      return await this.statisticService.getTopRich()
    } catch (error) {
      throw new InternalServerErrorException(error?.message)
    }
  }

  @Get("top-connected-time")
  async getTopConnectedTime(): Promise<Partial<users>[]> {
    try {
      return await this.statisticService.getTopConnectedTime()
    } catch (error) {
      throw new InternalServerErrorException(error?.message)
    }
  }

  @Get("tickets")
  async getTicketsStatistic() {
    try {
      return await this.statisticService.getTickets()
    } catch (error) {
      throw new InternalServerErrorException(error?.message)
    }
  }
}
