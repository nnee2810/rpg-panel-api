import { Type } from "class-transformer"
import { IsBoolean, IsNumber, IsOptional, IsString, Min } from "class-validator"
import { PaginationDto } from "src/dto"

export class GetUsersDto extends PaginationDto {
  @IsOptional()
  @IsString()
  name?: string

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  Status?: number

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  Admin?: number

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isAdmin?: boolean

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  Helper?: number

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isHelper?: boolean

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  Leader?: number

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isLeader?: boolean

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  Member?: number

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  Job?: number
}
