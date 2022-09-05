import { Module } from "@nestjs/common"
import { UsersModule } from "../users/users.module"
import { TopupController } from "./topup.controller"
import { TopupService } from "./topup.service"

@Module({
  imports: [UsersModule],
  controllers: [TopupController],
  providers: [TopupService],
})
export class TopupModule {}
