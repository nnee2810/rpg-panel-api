import { ValidationPipe } from "@nestjs/common"
import { NestFactory } from "@nestjs/core"
import * as cookieParser from "cookie-parser"
import helmet from "helmet"
import { AppModule } from "./app.module"
import { PrismaService } from "./modules/prisma/prisma.service"

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
  })

  app.use(cookieParser())
  app.use(helmet())
  app.useGlobalPipes(new ValidationPipe({ transform: true }))

  const prismaService = app.get(PrismaService)
  await prismaService.enableShutdownHooks(app)

  await app.listen(5000)
}
bootstrap()
