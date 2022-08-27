import { PanelTicketCategory } from "@prisma/client"
import { IsIn, IsString, MaxLength } from "class-validator"

export class CreateTicketDto {
  @IsIn(Object.keys(PanelTicketCategory))
  category: PanelTicketCategory

  @IsString()
  @MaxLength(56)
  title: string

  @IsString()
  @MaxLength(512)
  description: string
}
