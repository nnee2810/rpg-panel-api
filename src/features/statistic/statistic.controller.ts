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
}
