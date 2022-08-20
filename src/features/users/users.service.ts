import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common"
import { Prisma } from "@prisma/client"
import { toJSON } from "src/utils"
import { PrismaService } from "../prisma/prisma.service"
import { GetUsersDto } from "./dto"
@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  async getAll({ page, take, ...query }: GetUsersDto) {
    try {
      const where: Prisma.usersWhereInput = {
        name: {
          contains: query.name,
        },
        Status: query.Status,
        Admin: {
          equals: query.Admin,
          gte: query.isAdmin && 1,
        },
        Helper: {
          equals: query.Helper,
          gte: query.isHelper && 1,
        },
        Leader: {
          equals: query.Leader,
          gte: query.isLeader && 1,
        },
        Member: query.Member,
        Job: query.Job,
      }

      const [data, total] = await this.prismaService.$transaction([
        this.prismaService.users.findMany({
          select: {
            id: true,
            name: true,
            Level: true,
            Admin: true,
            Helper: true,
            Leader: true,
            Member: true,
            Job: true,
            Status: true,
            lastOn: true,
            ConnectedTime: true,
          },
          where,
          skip: (page - 1) * take,
          take,
          orderBy: {
            Admin: query.isAdmin ? "desc" : undefined,
            Helper: query.isHelper ? "desc" : undefined,
            Leader: query.isLeader ? "asc" : undefined,
          },
        }),
        this.prismaService.users.count({ where }),
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

  async getProfileByName(name: string) {
    try {
      const user = await this.prismaService.users.findFirst({
        select: {
          id: true,
          name: true,
          Status: true,
          Premium: true,
          Vip: true,
          Level: true,
          Respect: true,
          Member: true,
          Rank: true,
          Clan: true,
          ClanRank: true,
          Job: true,
          PhoneNr: true,
          FPunish: true,
          Warns: true,
          ConnectedTime: true,
          lastOn: true,
          RegisterDate: true,
          Referral: true,
        },
        where: { name },
      })
      if (!user) throw new NotFoundException("Người chơi không tồn tại")
      if (user.Clan) {
        const clan = await this.prismaService.clans.findUnique({
          where: { ID: user.Clan },
        })
        if (clan) user["clan"] = clan
      }

      return user
    } catch (error) {
      throw new InternalServerErrorException(error?.message)
    }
  }

  async getPropertiesByName(name: string) {
    try {
      const vehicles = await this.prismaService.cars.findMany({
        where: { Owner: name },
      })
      const house = await this.prismaService.houses.findFirst({
        select: {
          ID: true,
          Discription: true,
          Value: true,
          Rent: true,
          Rentabil: true,
          Lockk: true,
        },
        where: {
          Owner: name,
        },
      })
      const bizz = toJSON(
        await this.prismaService.bizz.findFirst({
          select: {
            ID: true,
            Message: true,
            BuyPrice: true,
            EntranceCost: true,
            Locked: true,
          },
          where: {
            Owner: name,
          },
        }),
      )
      return { vehicles, house, bizz }
    } catch (error) {
      throw new InternalServerErrorException(error?.message)
    }
  }

  async updateByName(name: string, data: Prisma.usersUpdateInput) {
    try {
      await this.prismaService.users.updateMany({
        data,
        where: {
          name,
        },
      })
    } catch (error) {
      throw new InternalServerErrorException(error?.message)
    }
  }
}
