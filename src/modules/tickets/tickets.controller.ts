import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
} from "@nestjs/common"
import { panel_tickets } from "@prisma/client"
import { RequestWithUser } from "src/interfaces"
import { CreateTicketDto, GetTicketsDto, UpdateTicketDto } from "./dto"
import { TicketsService } from "./tickets.service"

@Controller("tickets")
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post()
  async createTicket(
    @Req() req: RequestWithUser,
    @Body() body: CreateTicketDto,
  ) {
    const ticket = await this.ticketsService.create(req.user.id, body)
    return ticket
  }

  @Get()
  async getTickets(@Query() query: GetTicketsDto) {
    const tickets = this.ticketsService.getAll(query)
    return tickets
  }

  @Get(":id")
  async getTicketById(
    @Param(":id", ParseIntPipe) id: number,
  ): Promise<panel_tickets> {
    const ticket = await this.ticketsService.getById(id)
    if (!ticket) throw new NotFoundException()
    return ticket
  }

  @Patch(":id")
  async updateTicketById(
    @Param(":id", ParseIntPipe) id: number,
    data: UpdateTicketDto,
  ): Promise<panel_tickets> {
    const ticket = this.ticketsService.updateById(id, data)
    if (!ticket) throw new NotFoundException()
    return ticket
  }
}
