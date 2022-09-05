import {
  Controller,
  Get,
  HttpException,
  InternalServerErrorException,
  NotFoundException,
  Param,
  ParseIntPipe,
  Query,
} from "@nestjs/common"
import { factions, users } from "@prisma/client"
import { PaginationDto } from "src/dto"
import { PaginationData } from "src/interfaces"
import { FactionsService } from "./factions.service"

@Controller("factions")
export class FactionsController {
  constructor(private factionsService: FactionsService) {}

  @Get()
  async getFactions(
    @Query() query: PaginationDto,
  ): Promise<PaginationData<Partial<factions>>> {
    try {
      const paginationData = await this.factionsService.getAll(query)
      return paginationData
    } catch (error) {
      throw new InternalServerErrorException(error?.message)
    }
  }

  @Get(":id/overview")
  async getFactionOverview(
    @Param("id", ParseIntPipe) id: number,
  ): Promise<Partial<factions>> {
    try {
      const faction = await this.factionsService.getOverview(id)
      if (!faction) throw new NotFoundException("Không tìm thấy faction")
      return faction
    } catch (error) {
      if (error instanceof HttpException)
        throw new HttpException(error.message, error.getStatus())
      throw new InternalServerErrorException(error?.message)
    }
  }

  @Get(":id/members")
  async getFactionMembers(
    @Param("id", ParseIntPipe) id: number,
    @Query() query: PaginationDto,
  ): Promise<PaginationData<Partial<users>>> {
    try {
      const paginationData = await this.factionsService.getMembers(id, query)
      return paginationData
    } catch (error) {
      throw new InternalServerErrorException(error?.message)
    }
  }
}
