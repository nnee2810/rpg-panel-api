import { Controller, Get } from "@nestjs/common"
import { FactionsService } from "./factions.service"

@Controller("factions")
export class FactionsController {
  constructor(private factionsService: FactionsService) {}

  @Get()
  async getFactions() {
    const factions = await this.factionsService.getFactions()
    return factions
  }
}
