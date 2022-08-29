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
import { PaginationDto } from "src/dto"
import { RequestWithUser } from "src/interfaces"
import {
  CreateTicketCommentDto,
  CreateTicketDto,
  GetTicketsDto,
  UpdateTicketDto,
} from "./dto"
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
  async getTickets(
    @Req() { user }: RequestWithUser,
    @Query() query: GetTicketsDto,
  ) {
    const tickets = this.ticketsService.getAll({
      ...query,
      userId: user.Admin ? undefined : user.id,
    })
    return tickets
  }

  @Get(":id")
  async getTicketById(
    @Param("id", ParseIntPipe) id: number,
  ): Promise<panel_tickets> {
    const ticket = await this.ticketsService.getById(id)
    if (!ticket) throw new NotFoundException()
    return ticket
  }

  @Patch(":id")
  async updateTicketById(
    @Param("id", ParseIntPipe) id: number,
    data: UpdateTicketDto,
  ): Promise<panel_tickets> {
    const ticket = this.ticketsService.updateById(id, data)
    if (!ticket) throw new NotFoundException()
    return ticket
  }

  @Post(":id/comments")
  async createTicketComment(
    @Req() req: RequestWithUser,
    @Param("id", ParseIntPipe) id: number,
    @Body() body: CreateTicketCommentDto,
  ) {
    const comments = this.ticketsService.createComment(req.user.id, id, body)
    return comments
  }

  @Get(":id/comments")
  async getTicketComments(
    @Param("id", ParseIntPipe) id: number,
    @Query() query: PaginationDto,
  ) {
    const comments = this.ticketsService.getComments(id, query)
    return comments
  }
}
