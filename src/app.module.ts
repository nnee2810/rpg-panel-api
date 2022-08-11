import { Module } from "@nestjs/common"
import { APP_GUARD } from "@nestjs/core"
import { AppController } from "./app.controller"
import { AppService } from "./app.service"
import { AuthModule } from "./features/auth/auth.module"
import { AdminGuard, JwtGuard } from "./features/auth/guards"
import { FactionsModule } from "./features/factions/factions.module"
import { PrismaModule } from "./features/prisma/prisma.module"
import { PrismaService } from "./features/prisma/prisma.service"
import { StatisticModule } from "./features/statistic/statistic.module"
import { UsersModule } from "./features/users/users.module"

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UsersModule,
    StatisticModule,
    FactionsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    PrismaService,
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
    {
      provide: APP_GUARD,
      useClass: AdminGuard,
    },
  ],
})
export class AppModule {}
