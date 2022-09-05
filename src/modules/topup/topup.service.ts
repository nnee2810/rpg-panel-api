import { Injectable } from "@nestjs/common"
import { panel_topup_logs, Prisma, users } from "@prisma/client"
import * as crypto from "crypto"
import * as moment from "moment"
import * as qs from "qs"
import { PaginationData, RequestWithUser } from "src/interfaces"
import { sortObject } from "src/utils"
import { PrismaService } from "../prisma/prisma.service"
import { CreatePaymentDto, GetTxnLogsDto, ProcessPaymentDto } from "./dto"

@Injectable()
export class TopupService {
  constructor(private prismaService: PrismaService) {}

  createTxn(user: users, received: number, data: ProcessPaymentDto) {
    return this.prismaService.panel_topup_logs.create({
      data: {
        userId: user.id,
        responseCode: data.vnp_ResponseCode,
        amount: data.vnp_Amount / 100,
        received,
        newBalance: user.PremiumPoints,
        transactionNo: data.vnp_TransactionNo,
        txnRef: data.vnp_TxnRef,
      },
    })
  }

  async getTxnLogs(
    where: Prisma.panel_topup_logsWhereInput,
    { page, take }: GetTxnLogsDto,
  ): Promise<PaginationData<panel_topup_logs>> {
    const [data, total] = await this.prismaService.$transaction([
      this.prismaService.panel_topup_logs.findMany({
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        where,
        orderBy: {
          createdAt: "desc",
        },
        skip: (page - 1) * take,
        take,
      }),
      this.prismaService.panel_topup_logs.count({ where }),
    ])
    return {
      data,
      total,
      page,
      take,
    }
  }

  getTxn(txnRef: string) {
    return this.prismaService.panel_topup_logs.findUnique({
      where: {
        txnRef,
      },
    })
  }

  createPayment(req: RequestWithUser, { amount }: CreatePaymentDto): string {
    const currentTime = moment()
    const params = {
      vnp_Version: "2.1.0",
      vnp_Command: "pay",
      vnp_TmnCode: process.env.VNP_TMN_CODE,
      vnp_Amount: amount * 100,
      vnp_CreateDate: currentTime.format("YYYYMMDDHHmmss"),
      vnp_CurrCode: "VND",
      vnp_IpAddr: req.ip,
      vnp_Locale: "vn",
      vnp_OrderInfo: `Thanh toan goi nap ${amount} cho ${req.user.name}`,
      vnp_ReturnUrl: process.env.VNP_RETURN_URL,
      vnp_TxnRef: currentTime.format("DDMMYYYYHHmmss") + req.user.id,
    }
    const sortedParams = sortObject(params)
    const signData = qs.stringify(sortedParams, { encode: false })
    const hmac = crypto.createHmac("sha512", process.env.VNP_HASH_SECRET)
    const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex")
    sortedParams["vnp_SecureHash"] = signed

    return `${process.env.VNP_URL}?${qs.stringify(sortedParams, {
      encode: false,
    })}`
  }

  isValidPayment(data: ProcessPaymentDto): boolean {
    const { vnp_SecureHash, ...params } = data
    const sortedParams = sortObject(params)
    const signData = qs.stringify(sortedParams, { encode: false })
    const hmac = crypto.createHmac("sha512", process.env.VNP_HASH_SECRET)
    const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex")

    if (vnp_SecureHash === signed) return true
    return false
  }
}
