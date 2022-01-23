import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export default class JwtRefreshGaurd extends AuthGuard('jwt-refresh-token') {}