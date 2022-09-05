import { Injectable } from "@nestjs/common"
import { panel_tickets, panel_ticket_comments, Prisma } from "@prisma/client"
import { PaginationDto } from "src/dto"
import { PaginationData } from "src/interfaces"
import { PrismaService } from "src/modules/prisma/prisma.service"
import { CreateTicketCommentDto, CreateTicketDto, UpdateTicketDto } from "./dto"

@Injectable()
export class TicketsService {
  constructor(private prismaService: PrismaService) {}

  create(userId: number, data: CreateTicketDto): Promise<panel_tickets> {
    return this.prismaService.panel_tickets.create({
      data: {
        userId,
        ...data,
      },
    })
  }

  async getAll(
    where: Prisma.panel_ticketsWhereInput,
    { page, take }: PaginationDto,
  ): Promise<PaginationData<Partial<panel_tickets>>> {
    const [data, total] = await this.prismaService.$transaction([
      this.prismaService.panel_tickets.findMany({
        select: {
          id: true,
          user: {
            select: {
              id: true,
              name: true,
            },
          },
          assignTo: {
            select: {
              id: true,
              name: true,
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
          createdAt: "desc",
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
  }

  getById(id: number): Promise<panel_tickets> {
    return this.prismaService.panel_tickets.findUnique({
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
        assignTo: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      where: {
        id,
      },
    })
  }

  updateById(ticketId: number, data: UpdateTicketDto): Promise<panel_tickets> {
    return this.prismaService.panel_tickets.update({
      data: data || {},
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
        assignTo: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      where: {
        id: ticketId,
      },
    })
  }

  createComment(
    ticketId: number,
    userId: number,
    data: CreateTicketCommentDto,
  ): Promise<panel_ticket_comments> {
    return this.prismaService.panel_ticket_comments.create({
      data: {
        ticketId,
        userId,
        ...data,
      },
    })
  }

  async getComments(
    ticketId: number,
    { page, take }: PaginationDto,
  ): Promise<PaginationData<panel_ticket_comments>> {
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
  }
}
