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
import { clans, users } from "@prisma/client"
import { PaginationDto } from "src/dto"
import { PaginationData } from "src/interfaces"
import { ClansService } from "./clans.service"

@Controller("clans")
export class ClansController {
  constructor(private clansService: ClansService) {}

  @Get()
  async getClans(
    @Query() query: PaginationDto,
  ): Promise<PaginationData<Partial<clans>>> {
    try {
      return await this.clansService.getAll(query)
    } catch (error) {
      throw new InternalServerErrorException(error?.message)
    }
  }

  @Get(":id/overview")
  async getClanOverview(@Param("id", ParseIntPipe) id: number): Promise<clans> {
    try {
      const clan = await this.clansService.getOverview(id)
      if (!clan) throw new NotFoundException("Không tìm thấy clan")
      return clan
    } catch (error) {
      if (error instanceof HttpException)
        throw new HttpException(error.message, error.getStatus())
      throw new InternalServerErrorException(error?.message)
    }
  }

  @Get(":id/members")
  async getClanMembers(
    @Param("id", ParseIntPipe) id: number,
    @Query() query: PaginationDto,
  ): Promise<PaginationData<Partial<users>>> {
    try {
      return await this.clansService.getMembers(id, query)
    } catch (error) {
      throw new InternalServerErrorException(error?.message)
    }
  }
}
