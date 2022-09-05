import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpException,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
  Query,
  Req,
  Res,
} from "@nestjs/common"
import { panel_topup_logs } from "@prisma/client"
import { Response } from "express"
import { PaginationData, RequestWithUser } from "src/interfaces"
import { PublicRoute } from "../auth/decorators"
import { UsersService } from "../users/users.service"
import { CreatePaymentDto, GetTxnLogsDto, ProcessPaymentDto } from "./dto"
import { TopupService } from "./topup.service"

@Controller("topup")
export class TopupController {
  constructor(
    private topupService: TopupService,
    private usersService: UsersService,
  ) {}

  @Get("txn")
  async getTxnLogs(
    @Req() req: RequestWithUser,
    @Query() { name, page, take }: GetTxnLogsDto,
  ): Promise<PaginationData<panel_topup_logs>> {
    try {
      const paginationData = await this.topupService.getTxnLogs(
        {
          user: {
            id: req.user.Admin ? undefined : req.user.id,
            name: {
              contains: name,
            },
          },
        },
        { page, take },
      )
      return paginationData
    } catch (error) {
      throw new InternalServerErrorException(error?.message)
    }
  }

  @Get("txn/:txnRef")
  async getTxn(
    @Req() req: RequestWithUser,
    @Param("txnRef") txnRef: string,
  ): Promise<panel_topup_logs> {
    try {
      const txn = await this.topupService.getTxn(txnRef)
      if (!txn) throw new NotFoundException("Không tìm thấy giao dịch")
      if (!req.user.Admin && req.user.id !== txn.userId)
        throw new ForbiddenException()
      return txn
    } catch (error) {
      if (error instanceof HttpException)
        throw new HttpException(error.message, error.getStatus())
      throw new InternalServerErrorException(error?.message)
    }
  }

  @Post("create-payment")
  createPayment(
    @Req() req: RequestWithUser,
    @Body() body: CreatePaymentDto,
  ): string {
    try {
      if (req.user.Status === 1)
        throw new BadRequestException("Hãy thoát game trước khi thanh toán")
      const paymentUrl = this.topupService.createPayment(req, body)
      return paymentUrl
    } catch (error) {
      if (error instanceof HttpException)
        throw new HttpException(error.message, error.getStatus())
      throw new InternalServerErrorException(error?.message)
    }
  }

  @PublicRoute()
  @Get("process-payment")
  async processPayment(
    @Res() res: Response,
    @Query() query: ProcessPaymentDto,
  ) {
    try {
      if (!query?.vnp_ResponseCode)
        return res.redirect(`${process.env.PANEL_URL}/topup`)
      if (!this.topupService.isValidPayment(query))
        throw new BadRequestException("Giao dịch không hợp lệ")
      const userId = +query.vnp_TxnRef.slice(14)
      const txn = await this.topupService.getTxn(query.vnp_TxnRef)
      if (txn) throw new BadRequestException("Giao dịch đã xử lý")
      const received =
        query.vnp_ResponseCode === "00" ? query.vnp_Amount / 100 / 500 : 0
      const user = await this.usersService.updateById(userId, {
        PremiumPoints: {
          increment: received,
        },
      })
      await this.topupService.createTxn(user, received, query)
      return res.redirect(
        `${process.env.PANEL_URL}/topup/txn/${query.vnp_TxnRef}`,
      )
    } catch (error) {
      if (error instanceof HttpException)
        throw new HttpException(error.message, error.getStatus())
      throw new InternalServerErrorException(error?.message)
    }
  }
}
