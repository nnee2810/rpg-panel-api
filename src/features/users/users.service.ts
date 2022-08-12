import { Injectable, InternalServerErrorException } from "@nestjs/common"
import { Prisma } from "@prisma/client"
import { PrismaService } from "../prisma/prisma.service"
import { GetUsersDto } from "./dto"
@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  async getUsers({ page = 1, take = 20, ...query }: GetUsersDto) {
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
      throw new InternalServerErrorException(error?.message || error?.detail)
    }
  }
}
