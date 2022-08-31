import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common"
import { Reflector } from "@nestjs/core"
import { RequestWithUser } from "src/interfaces"

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredAdminLevel = this.reflector.getAllAndOverride<number>(
      "admin",
      [context.getHandler(), context.getClass()],
    )
    if (!requiredAdminLevel) return true
    const { user } = context.switchToHttp().getRequest<RequestWithUser>()
    return user.Admin >= requiredAdminLevel
  }
}
