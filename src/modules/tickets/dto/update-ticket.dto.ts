import { PanelTicketCategory, PanelTicketStatus } from "@prisma/client"
import { IsIn, IsNumber, IsOptional } from "class-validator"

export class UpdateTicketDto {
  @IsOptional()
  @IsIn(Object.keys(PanelTicketCategory))
  category?: PanelTicketCategory

  @IsOptional()
  @IsIn(Object.keys(PanelTicketStatus))
  status?: PanelTicketStatus

  @IsOptional()
  @IsNumber()
  assignToId?: number
}
