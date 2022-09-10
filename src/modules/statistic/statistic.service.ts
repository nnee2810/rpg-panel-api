import { Injectable } from "@nestjs/common"
import { PanelTicketStatus, users } from "@prisma/client"
import { toJSON } from "src/utils"
import { PrismaService } from "../prisma/prisma.service"

@Injectable()
export class StatisticService {
  constructor(private prismaService: PrismaService) {}

  async getServer() {
    const [registered, online, houses, bizz, faction_logs] =
      await this.prismaService.$transaction([
        this.prismaService.users.count(),
        this.prismaService.users.count({
          where: {
            Status: 1,
          },
        }),
        this.prismaService.houses.count(),
        this.prismaService.bizz.count(),
        this.prismaService.faction_logs.findMany({
          orderBy: {
            id: "desc",
          },
          take: 10,
        }),
      ])

    return { registered, online, houses, bizz, faction_logs }
  }

  getTopLevel(): Promise<Partial<users>[]> {
    return this.prismaService.users.findMany({
      select: {
        id: true,
        name: true,
        Level: true,
        lastOn: true,
      },
      orderBy: {
        Level: "desc",
      },
      take: 10,
    })
  }

  async getTopRich(): Promise<Partial<users>[]> {
    return toJSON(
      await this.prismaService
        .$queryRaw`SELECT id, name, Status, lastOn, (Bank + Money) as totalMoney FROM users ORDER BY totalMoney DESC LIMIT 10`,
    )
  }

  getTopConnectedTime(): Promise<Partial<users>[]> {
    return this.prismaService.users.findMany({
      select: {
        id: true,
        name: true,
        lastOn: true,
        ConnectedTime: true,
      },
      orderBy: {
        ConnectedTime: "desc",
      },
      take: 10,
    })
  }

  async getTickets() {
    const [openTickets, closeTickets] = await this.prismaService.$transaction([
      this.prismaService.panel_tickets.count({
        where: {
          status: PanelTicketStatus.OPEN,
        },
      }),
      this.prismaService.panel_tickets.count({
        where: {
          status: PanelTicketStatus.CLOSE,
        },
      }),
    ])

    return { openTickets, closeTickets }
  }
}
