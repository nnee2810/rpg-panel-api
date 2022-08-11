import { Injectable, InternalServerErrorException } from "@nestjs/common"
import { PrismaService } from "../prisma/prisma.service"

@Injectable()
export class FactionsService {
  constructor(private prismaService: PrismaService) {}

  async getFactions() {
    try {
      const factions = await this.prismaService.factions.findMany({
        select: {
          ID: true,
          Name: true,
          Slots: true,
          Level: true,
          App: true,
        },
      })
      const membersPromises = []
      for (let i = 0; i < factions.length; i++)
        membersPromises.push(
          this.prismaService.users.count({
            where: { Member: i + 1 },
          }),
        )
      const members = await Promise.all(membersPromises)
      for (let i = 0; i < factions.length; i++)
        factions[i]["Members"] = members[i]

      return factions
    } catch (error) {
      throw new InternalServerErrorException(error?.message || error?.detail)
    }
  }
}
