import { PanelTicketCategory, PanelTicketStatus } from "@prisma/client"
import { Type } from "class-transformer"
import {
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from "class-validator"
import { PaginationDto } from "src/dto"

export class GetTicketsDto extends PaginationDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  userId?: number

  @IsOptional()
  @IsIn(Object.keys(PanelTicketCategory))
  category?: PanelTicketCategory

  @IsOptional()
  @IsIn(Object.keys(PanelTicketStatus))
  status?: PanelTicketStatus

  @IsOptional()
  @IsString()
  @MaxLength(56)
  title?: string
}
