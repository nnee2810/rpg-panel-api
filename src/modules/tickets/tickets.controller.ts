import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpException,
  InternalServerErrorException,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
} from "@nestjs/common"
import {
  PanelTicketStatus,
  panel_tickets,
  panel_ticket_comments,
} from "@prisma/client"
import { PaginationDto } from "src/dto"
import { PaginationData, RequestWithUser } from "src/interfaces"
import { Admin } from "../auth/decorators"
import {
  CreateTicketCommentDto,
  CreateTicketDto,
  GetTicketsDto,
  UpdateTicketDto,
} from "./dto"
import { TicketsService } from "./tickets.service"

@Controller("tickets")
export class TicketsController {
  constructor(private ticketsService: TicketsService) {}

  @Post()
  async createTicket(
    @Req() req: RequestWithUser,
    @Body() body: CreateTicketDto,
  ): Promise<panel_tickets> {
    try {
      const totalTickets = (
        await this.getTickets(req, {
          status: PanelTicketStatus.OPEN,
          page: 1,
          take: 0,
        })
      ).total
      if (totalTickets > 2)
        throw new BadRequestException("Bạn đang có 3 phiếu đang mở")
      return await this.ticketsService.create(req.user.id, body)
    } catch (error) {
      if (error instanceof HttpException)
        throw new HttpException(error.message, error.getStatus())
      throw new InternalServerErrorException(error?.message)
    }
  }

  @Get()
  async getTickets(
    @Req() req: RequestWithUser,
    @Query() { title, page, take, ...query }: GetTicketsDto,
  ): Promise<PaginationData<Partial<panel_tickets>>> {
    try {
      return await this.ticketsService.getAll(
        {
          ...query,
          userId: req.user.Admin ? undefined : req.user.id,
          title: {
            contains: title,
          },
        },
        {
          page,
          take,
        },
      )
    } catch (error) {
      throw new InternalServerErrorException(error?.message)
    }
  }

  @Get(":id")
  async getTicketById(
    @Req() req: RequestWithUser,
    @Param("id", ParseIntPipe) id: number,
  ): Promise<panel_tickets> {
    try {
      const ticket = await this.ticketsService.getById(id)
      if (!ticket) throw new NotFoundException("Không tìm thấy phiếu")
      if (!req.user.Admin && req.user.id !== ticket.userId)
        throw new ForbiddenException()
      return ticket
    } catch (error) {
      if (error instanceof HttpException)
        throw new HttpException(error.message, error.getStatus())
      throw new InternalServerErrorException(error?.message)
    }
  }

  @Admin(1)
  @Patch(":id")
  async updateTicketById(
    @Req() req: RequestWithUser,
    @Param("id", ParseIntPipe) id: number,
    @Body() body: UpdateTicketDto,
  ): Promise<panel_tickets> {
    try {
      await this.getTicketById(req, id)
      return await this.ticketsService.updateById(id, body)
    } catch (error) {
      if (error instanceof HttpException)
        throw new HttpException(error.message, error.getStatus())
      throw new InternalServerErrorException(error?.message)
    }
  }

  @Post(":id/comments")
  async createTicketComment(
    @Req() req: RequestWithUser,
    @Param("id", ParseIntPipe) id: number,
    @Body() body: CreateTicketCommentDto,
  ): Promise<panel_ticket_comments> {
    try {
      const ticket = await this.getTicketById(req, id)
      if (ticket.status === PanelTicketStatus.CLOSE)
        throw new BadRequestException("Phiếu đã đóng, vui lòng tải lại trang")
      const comment = await this.ticketsService.createComment(
        id,
        req.user.id,
        body,
      )
      if (!ticket.assignToId && !!req.user.Admin)
        this.updateTicketById(req, id, {
          assignToId: req.user.id,
        })
      return comment
    } catch (error) {
      if (error instanceof HttpException)
        throw new HttpException(error.message, error.getStatus())
      throw new InternalServerErrorException(error?.message)
    }
  }

  @Get(":id/comments")
  async getTicketComments(
    @Param("id", ParseIntPipe) id: number,
    @Query() query: PaginationDto,
  ): Promise<PaginationData<panel_ticket_comments>> {
    try {
      await this.ticketsService.getById(id)
      return await this.ticketsService.getComments(id, query)
    } catch (error) {
      throw new InternalServerErrorException(error?.message)
    }
  }
}
