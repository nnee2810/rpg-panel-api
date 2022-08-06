import { ValidationPipe } from "@nestjs/common"
import { NestFactory, Reflector } from "@nestjs/core"
import { AppModule } from "./app.module"
import { AdminGuard, JwtGuard } from "./features/auth/guards"
import { PrismaService } from "./features/prisma/prisma.service"

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const reflector = app.get(Reflector)

  const prismaService = app.get(PrismaService)
  await prismaService.enableShutdownHooks(app)

  app.useGlobalPipes(new ValidationPipe())
  app.useGlobalPipes(new ValidationPipe({ transform: true }))
  app.useGlobalGuards(new JwtGuard(reflector))
  app.useGlobalGuards(new AdminGuard(reflector))

  await app.listen(5000)
}
bootstrap()
