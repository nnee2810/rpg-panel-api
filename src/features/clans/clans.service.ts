import { Injectable, InternalServerErrorException } from "@nestjs/common"
import { PaginationDto } from "src/dto"
import { PrismaService } from "../prisma/prisma.service"

@Injectable()
export class ClansService {
  constructor(private prismaService: PrismaService) {}

  async getAll({ page, take }: PaginationDto) {
    try {
      const [data, total] = await this.prismaService.$transaction([
        this.prismaService.clans.findMany({
          select: {
            ID: true,
            Name: true,
            Tag: true,
            Owner: true,
            Color: true,
            Slots: true,
            RegisterDate: true,
          },
          skip: (page - 1) * take,
          take,
        }),
        this.prismaService.clans.count(),
      ])
      const membersPromises = []
      for (const clan of data)
        membersPromises.push(
          this.prismaService.users.count({
            where: { Clan: clan.ID },
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
