import { Injectable, InternalServerErrorException } from "@nestjs/common"
import { PrismaService } from "../prisma/prisma.service"
import { GetUsersDto } from "./dto"

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  async getUsers(query: GetUsersDto) {
    try {
      const users = await this.prismaService.users.findMany({
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
        where: {
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
        },
        orderBy: {
          Admin: query.isAdmin ? "desc" : undefined,
          Helper: query.isHelper ? "desc" : undefined,
          Leader: query.isLeader ? "asc" : undefined,
        },
      })
      return users
    } catch (error) {
      throw new InternalServerErrorException(error?.message || error?.detail)
    }
  }
}
