import { Controller, Get, Query } from "@nestjs/common"
import { PaginationDto } from "src/dto"
import { ClansService } from "./clans.service"

@Controller("clans")
export class ClansController {
  constructor(private readonly clansService: ClansService) {}

  @Get()
  async getClans(@Query() query: PaginationDto) {
    const clans = await this.clansService.findAll(query)
    return clans
  }
}
