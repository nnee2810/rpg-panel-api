import { Type } from "class-transformer"
import { IsNumber, IsOptional } from "class-validator"

export class PaginationDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  page = 1

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  take = 10
}
