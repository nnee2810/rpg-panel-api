import { Injectable, InternalServerErrorException } from "@nestjs/common"
import { users } from "@prisma/client"
import { toJSON } from "src/utils"
import { PrismaService } from "../prisma/prisma.service"

@Injectable()
export class StatisticService {
  constructor(private prismaService: PrismaService) {}

  async getOverview() {
    const registered = await this.prismaService.users.count()
    const online = await this.prismaService.users.count({
      where: {
        Status: 1,
      },
    })
    const houses = await this.prismaService.houses.count()
    const bizz = await this.prismaService.bizz.count()
    const faction_logs = await this.prismaService.faction_logs.findMany({
      orderBy: {
        id: "desc",
      },
      take: 10,
    })

    return { online, registered, houses, bizz, faction_logs }
  }

  async getTopLevel(): Promise<Partial<users>[]> {
    const users = await this.prismaService.users.findMany({
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
    return users
  }

  async getTopRich(): Promise<Partial<users>[]> {
    try {
      const users = await this.prismaService
        .$queryRaw`SELECT id, name, Status, lastOn, (Bank + Money) as totalMoney FROM users ORDER BY totalMoney DESC LIMIT 10`
      return toJSON(users)
    } catch (error) {
      throw new InternalServerErrorException(error?.message)
    }
  }

  async getTopConnectedTime(): Promise<Partial<users>[]> {
    const users = await this.prismaService.users.findMany({
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
    return users
  }
}
