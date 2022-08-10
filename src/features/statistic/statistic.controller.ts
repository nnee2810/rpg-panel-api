import { Controller, Get } from "@nestjs/common"
import { StatisticService } from "./statistic.service"

@Controller("statistic")
export class StatisticController {
  constructor(private statisticService: StatisticService) {}

  @Get("overview")
  async getOverview() {
    const overview = await this.statisticService.getOverview()
    return overview
  }

  @Get("top-level")
  async getTopLevel() {
    const users = await this.statisticService.getTopLevel()
    return users
  }

  @Get("top-rich")
  async getTopRich() {
    const users = await this.statisticService.getTopRich()
    return users
  }

  @Get("top-connected-time")
  async getTopConnectedTime() {
    const users = await this.statisticService.getTopConnectedTime()
    return users
  }
}
