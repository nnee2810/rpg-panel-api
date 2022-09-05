import { Type } from "class-transformer"
import { IsNumber, IsOptional, IsString } from "class-validator"

export class ProcessPaymentDto {
  @IsNumber()
  @Type(() => Number)
  vnp_Amount: number

  @IsOptional()
  @IsString()
  vnp_BankCode?: string

  @IsOptional()
  @IsString()
  vnp_CardType?: string

  @IsString()
  vnp_OrderInfo: string

  @IsOptional()
  @IsString()
  vnp_PayDate?: string

  @IsOptional()
  @IsString()
  vnp_ResponseCode?: string

  @IsString()
  vnp_SecureHash: string

  @IsString()
  vnp_TmnCode: string

  @IsString()
  vnp_TransactionNo: string

  @IsString()
  vnp_TransactionStatus: string

  @IsString()
  vnp_TxnRef: string
}
