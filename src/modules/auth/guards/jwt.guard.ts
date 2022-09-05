import { ExecutionContext, Injectable } from "@nestjs/common"
import { Reflector } from "@nestjs/core"
import { AuthGuard } from "@nestjs/passport"

@Injectable()
export class JwtGuard extends AuthGuard("jwt") {
  constructor(private reflector: Reflector) {
    super()
  }

  canActivate(context: ExecutionContext) {
    const publicRoute = this.reflector.get<boolean>(
      "publicRoute",
      context.getHandler(),
    )
    if (publicRoute) return true
    return super.canActivate(context)
  }
}
