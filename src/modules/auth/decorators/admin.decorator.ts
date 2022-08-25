import { SetMetadata } from "@nestjs/common"

export const Admin = (adminLevel: number) => SetMetadata("admin", adminLevel)
