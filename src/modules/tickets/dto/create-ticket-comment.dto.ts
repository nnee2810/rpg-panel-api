import { IsString, MaxLength } from "class-validator"

export class CreateTicketCommentDto {
  @IsString()
  @MaxLength(300)
  content: string
}
