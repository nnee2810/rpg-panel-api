import {
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Query,
} from "@nestjs/common"
import { PaginationDto } from "src/dto"
import { ClansService } from "./clans.service"

@Controller("clans")
export class ClansController {
  constructor(private readonly clansService: ClansService) {}

  @Get()
  async getClans(@Query() query: PaginationDto) {
    const clans = await this.clansService.getAll(query)
    return clans
  }

  @Get(":id/overview")
  async getClanOverview(@Param("id", ParseIntPipe) id: number) {
    const clan = await this.clansService.getOverview(id)
    if (!clan) throw new NotFoundException()
    return clan
  }

  @Get(":id/members")
  async getClanMembers(
    @Param("id", ParseIntPipe) id: number,
    @Query() query: PaginationDto,
  ) {
    const members = await this.clansService.getMembers(id, query)
    if (!members) throw new NotFoundException()
    return members
  }
}
