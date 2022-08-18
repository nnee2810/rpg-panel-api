import { Controller, Get, Query } from "@nestjs/common"
import { PaginationDto } from "src/dto"
import { FactionsService } from "./factions.service"

@Controller("factions")
export class FactionsController {
  constructor(private factionsService: FactionsService) {}

  @Get()
  async getFactions(@Query() query: PaginationDto) {
    const factions = await this.factionsService.getAll(query)
    return factions
  }
}
