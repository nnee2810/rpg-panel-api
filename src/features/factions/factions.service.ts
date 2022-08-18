import { Injectable, InternalServerErrorException } from "@nestjs/common"
import { PaginationDto } from "src/dto"
import { PrismaService } from "../prisma/prisma.service"

@Injectable()
export class FactionsService {
  constructor(private prismaService: PrismaService) {}

  async getAll({ page, take }: PaginationDto) {
    try {
      const [data, total] = await this.prismaService.$transaction([
        this.prismaService.factions.findMany({
          select: {
            ID: true,
            Name: true,
            Slots: true,
            Level: true,
            App: true,
          },
          skip: (page - 1) * take,
          take,
        }),
        this.prismaService.factions.count(),
      ])

      const membersPromises = []
      for (const faction of data)
        membersPromises.push(
          this.prismaService.users.count({
            where: { Member: faction.ID },
          }),
        )
      const members = await Promise.all(membersPromises)
      for (let i = 0; i < data.length; i++) data[i]["Members"] = members[i]

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
