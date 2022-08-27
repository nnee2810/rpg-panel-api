import { Injectable, InternalServerErrorException } from "@nestjs/common"
import { panel_tickets } from "@prisma/client"
import { PaginationData } from "src/interfaces"
import { PrismaService } from "src/modules/prisma/prisma.service"
import { CreateTicketDto, GetTicketsDto, UpdateTicketDto } from "./dto"

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
            createdAt: true,
            updatedAt: true,
          },
          where: query,
          skip: (page - 1) * take,
          take,
        }),
        this.prismaService.panel_tickets.count({ where: query }),
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
        data,
        where: {
          id,
        },
      })
      return ticket
    } catch (error) {
      throw new InternalServerErrorException(error?.message)
    }
  }
}
