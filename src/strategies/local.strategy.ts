import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthService } from "src/auth/auth/auth.service";
import { User } from "src/user/entities/user.entity";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(
        private authService: AuthService
    ) {
        super({usernameField: 'username'});
    }

    async validate(username: string, password: string): Promise<User> {
         return this.authService.getAuthenticatedUser(username, password);
    }
}