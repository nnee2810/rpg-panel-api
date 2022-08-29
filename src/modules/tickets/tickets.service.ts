import { Injectable, InternalServerErrorException } from "@nestjs/common"
import { panel_tickets, panel_ticket_comments, Prisma } from "@prisma/client"
import { PaginationDto } from "src/dto"
import { PaginationData } from "src/interfaces"
import { PrismaService } from "src/modules/prisma/prisma.service"
import {
  CreateTicketCommentDto,
  CreateTicketDto,
  GetTicketsDto,
  UpdateTicketDto,
} from "./dto"

@Injectable()
export class TicketsService {
  constructor(private prismaService: PrismaService) {}

  async create(userId: number, data: CreateTicketDto): Promise<panel_tickets> {
    try {
      const ticket = await this.prismaService.panel_tickets.create({
        data: {
          userId,
          ...data,
        },
      })
      return ticket
    } catch (error) {
      throw new InternalServerErrorException(error?.message)
    }
  }

  async getAll({
    page,
    take,
    ...query
  }: GetTicketsDto): Promise<PaginationData<Partial<panel_tickets>>> {
    try {
      const where: Prisma.panel_ticketsWhereInput = {
        ...query,
        title: {
          contains: query.title,
        },
      }

      const [data, total] = await this.prismaService.$transaction([
        this.prismaService.panel_tickets.findMany({
          select: {
            id: true,
            user: {
              select: {
                id: true,
                name: true,
                Level: true,
                Status: true,
              },
            },
            category: true,
            title: true,
            status: true,
            createdAt: true,
            updatedAt: true,
          },
          where,
          orderBy: {
            updatedAt: "desc",
          },
          skip: (page - 1) * take,
          take,
        }),
        this.prismaService.panel_tickets.count({ where }),
      ])
      return {
        data,
        total,
        page,
        take,
      }
    } catch (error) {
      throw new InternalServerErrorException(error?.message)
    }
  }

  async getById(id: number): Promise<panel_tickets> {
    try {
      const ticket = await this.prismaService.panel_tickets.findUnique({
        include: {
          user: {
            select: {
              id: true,
              name: true,
              Status: true,
            },
          },
        },
        where: {
          id,
        },
      })
      return ticket
    } catch (error) {
      throw new InternalServerErrorException(error?.message)
    }
  }

  async updateById(id: number, data: UpdateTicketDto): Promise<panel_tickets> {
    try {
      const ticket = await this.prismaService.panel_tickets.update({
        data: data || {},
        where: {
          id,
        },
      })
      return ticket
    } catch (error) {
      throw new InternalServerErrorException(error?.message)
    }
  }

  async createComment(
    userId: number,
    ticketId: number,
    data: CreateTicketCommentDto,
  ) {
    try {
      const comment = await this.prismaService.panel_ticket_comments.create({
        data: {
          userId,
          ticketId,
          ...data,
        },
      })
      return comment
    } catch (error) {
      throw new InternalServerErrorException(error?.message)
    }
  }

  async getComments(
    ticketId: number,
    { page, take }: PaginationDto,
  ): Promise<PaginationData<panel_ticket_comments>> {
    try {
      const [data, total] = await this.prismaService.$transaction([
        this.prismaService.panel_ticket_comments.findMany({
          include: {
            user: {
              select: {
                id: true,
                name: true,
                Admin: true,
              },
            },
          },
          where: {
            ticketId,
          },
          orderBy: {
            createdAt: "desc",
          },
          skip: (page - 1) * take,
          take,
        }),
        this.prismaService.panel_ticket_comments.count({
          where: {
            ticketId,
          },
        }),
      ])
      return {
        data,
        total,
        page,
        take,
      }
    } catch (error) {
      throw new InternalServerErrorException(error?.message)
    }
  }
}
