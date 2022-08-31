import { Injectable } from "@nestjs/common"
import { factions, users } from "@prisma/client"
import { PaginationDto } from "src/dto"
import { PaginationData } from "src/interfaces"
import { PrismaService } from "../prisma/prisma.service"

@Injectable()
export class FactionsService {
  constructor(private prismaService: PrismaService) {}

  async getAll({
    page,
    take,
  }: PaginationDto): Promise<PaginationData<Partial<factions>>> {
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
  }

  async getOverview(id: number): Promise<Partial<factions>> {
    const faction = await this.prismaService.factions.findUnique({
      select: {
        ID: true,
        Name: true,
        Anunt: true,
        Name1: true,
        Name2: true,
        Name3: true,
        Name4: true,
        Name5: true,
        Name6: true,
        Name7: true,
        App: true,
        Lock: true,
      },
      where: { ID: id },
    })

    if (faction)
      faction["Leader"] = await this.prismaService.users.findFirst({
        select: {
          id: true,
          name: true,
        },
        where: {
          Leader: id,
        },
      })

    return faction
  }

  async getMembers(
    id: number,
    { page, take }: PaginationDto,
  ): Promise<PaginationData<Partial<users>>> {
    const [data, total] = await this.prismaService.$transaction([
      this.prismaService.users.findMany({
        select: {
          id: true,
          name: true,
          Rank: true,
          FWarn: true,
          Days: true,
          lastOn: true,
        },
        where: {
          Member: +id,
        },
        skip: (page - 1) * take,
        take,
        orderBy: {
          Rank: "desc",
        },
      }),
      this.prismaService.users.count({
        where: {
          Member: +id,
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
