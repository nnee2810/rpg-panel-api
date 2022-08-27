import { Injectable, InternalServerErrorException } from "@nestjs/common"
import { clans, users } from "@prisma/client"
import { PaginationDto } from "src/dto"
import { PaginationData } from "src/interfaces"
import { PrismaService } from "../prisma/prisma.service"

@Injectable()
export class ClansService {
  constructor(private prismaService: PrismaService) {}

  async getAll({
    page,
    take,
  }: PaginationDto): Promise<PaginationData<Partial<clans>>> {
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

  async getOverview(id: number) {
    try {
      const clan = await this.prismaService.clans.findUnique({
        where: {
          ID: id,
        },
      })
      return clan
    } catch (error) {
      throw new InternalServerErrorException(error?.message)
    }
  }

  async getMembers(
    id: number,
    { page, take }: PaginationDto,
  ): Promise<PaginationData<Partial<users>>> {
    try {
      const [data, total] = await this.prismaService.$transaction([
        this.prismaService.users.findMany({
          select: {
            id: true,
            name: true,
            ClanRank: true,
            ClanWarns: true,
            ClanDays: true,
            Status: true,
            lastOn: true,
          },
          where: {
            Clan: id,
          },
          orderBy: {
            ClanRank: "desc",
          },
          skip: (page - 1) * take,
          take,
        }),
        this.prismaService.users.count({ where: { Clan: id } }),
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
