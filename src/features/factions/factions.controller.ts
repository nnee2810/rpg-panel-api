import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
} from "@nestjs/common"
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

  @Get(":id/overview")
  async getFactionOverview(@Param("id") id: string) {
    const faction = await this.factionsService.getOverview(id)
    if (!faction) throw new NotFoundException()
    return faction
  }

  @Get(":id/members")
  async getFactionMembers(
    @Param("id") id: string,
    @Query() query: PaginationDto,
  ) {
    const members = await this.factionsService.getMembers(id, query)
    if (!members) throw new NotFoundException()
    return members
  }
}
