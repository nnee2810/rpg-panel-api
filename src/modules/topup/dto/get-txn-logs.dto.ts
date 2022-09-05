import { IsOptional, IsString } from "class-validator"
import { PaginationDto } from "src/dto"

export class GetTxnLogsDto extends PaginationDto {
  @IsOptional()
  @IsString()
  name?: string
}
