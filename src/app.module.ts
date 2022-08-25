import { Module } from "@nestjs/common"
import { APP_GUARD } from "@nestjs/core"
import { AppController } from "./app.controller"
import { AppService } from "./app.service"
import { AuthModule } from "./modules/auth/auth.module"
import { AdminGuard, JwtGuard } from "./modules/auth/guards"
import { ClansModule } from "./modules/clans/clans.module"
import { FactionsModule } from "./modules/factions/factions.module"
import { PrismaModule } from "./modules/prisma/prisma.module"
import { PrismaService } from "./modules/prisma/prisma.service"
import { StatisticModule } from "./modules/statistic/statistic.module"
import { UsersModule } from "./modules/users/users.module"
import { TicketsModule } from './tickets/tickets.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UsersModule,
    StatisticModule,
    FactionsModule,
    ClansModule,
    TicketsModule,
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
