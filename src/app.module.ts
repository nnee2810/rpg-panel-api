import { Module } from "@nestjs/common"
import { AppController } from "./app.controller"
import { AppService } from "./app.service"
import { AuthModule } from "./features/auth/auth.module"
import { PrismaModule } from "./features/prisma/prisma.module"
import { PrismaService } from "./features/prisma/prisma.service"
import { UsersModule } from './users/users.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [PrismaModule, AuthModule, UsersModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
