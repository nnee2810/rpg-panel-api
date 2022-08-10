import { Injectable, InternalServerErrorException } from "@nestjs/common"
import { PrismaService } from "../prisma/prisma.service"

@Injectable()
export class StatisticService {
  constructor(private prismaService: PrismaService) {}

  async getOverview() {
    try {
      const users = await this.prismaService.users.findMany()
      const registered = users.length
      const online = users.filter((user) => user.Status).length
      const apartaments = (await this.prismaService.apartaments.findMany())
        .length
      const bizz = (await this.prismaService.bizz.findMany()).length
      const faction_logs = await this.prismaService.faction_logs.findMany({
        orderBy: {
          id: "desc",
        },
        take: 10,
      })

      return { online, registered, apartaments, bizz, faction_logs }
    } catch (error) {
      throw new InternalServerErrorException(error?.message || error?.detail)
    }
  }

  async getOnline() {
    try {
      const users = await this.prismaService.users.findMany({
        select: {
          id: true,
          name: true,
          Level: true,
          Member: true,
          Job: true,
          ConnectedTime: true,
        },
        where: {
          Status: 1,
        },
      })
      return users
    } catch (error) {
      throw new InternalServerErrorException(error?.message || error?.detail)
    }
  }
}
