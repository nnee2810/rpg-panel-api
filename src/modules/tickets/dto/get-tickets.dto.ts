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
  @IsIn(Object.keys(PanelTicketCategory))
  category?: PanelTicketCategory

  @IsOptional()
  @IsIn(Object.keys(PanelTicketStatus))
  status?: PanelTicketStatus

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  assignToId?: number

  @IsOptional()
  @IsString()
  @MaxLength(56)
  title?: string
}
