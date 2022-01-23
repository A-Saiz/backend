import { Body, ClassSerializerInterceptor, Controller, Get, HttpCode, Post, Req, UseGuards, UseInterceptors } from "@nestjs/common";
import { Response } from "express";
import { LocalAuthGaurd } from "src/guards/auth.gaurds";
import JwtRefreshGaurd from "src/guards/jwt.refresh.gaurd";
import JwtAuthGaurd from "src/guards/jwtAuth.gaurd";
import RequestWithUser from "src/interfaces/requestWithUser.interface";
import { UserService } from "src/user/user.service";
import { SETTINGS } from "src/utils/app.utils";
import { RegisterDto } from "../registerDto";
import { AuthService } from "./auth.service";

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService
    ) {}

    @Post('register')
    async register(@Body(SETTINGS.VALIDATION_PIPE) registerDto: RegisterDto) {
        return this.authService.register(registerDto);
    }

    @HttpCode(200)
    @UseGuards(LocalAuthGaurd)
    @Post('log-in')
    async login(@Req() request: RequestWithUser) {
        const {user} = request;
        const cookie = this.authService.getCookieWithJwtToken(user.userID);
        const refreshCookie = this.authService.getCookieWithRefreshToken(user.userID);

        await this.userService.setCurrentRefreshToken(refreshCookie, user.userID)
        request.res.setHeader('Set-Cookie', [cookie, refreshCookie]);
        return user;
    }

    @UseGuards(JwtRefreshGaurd)
    @Get('refresh')
    refresh(@Req() request: RequestWithUser) {
        const accessTokenCookie = this.authService.getCookieWithJwtToken(request.user.userID);
        request.res.setHeader('Set-Cookie', accessTokenCookie);
        return request.user;
    }

    @UseGuards(JwtAuthGaurd)
    @Post('log-out')
    @HttpCode(200)
    async logout(@Req() request: RequestWithUser) {
        await this.userService.removeRefreshToken(request.user.userID);
        request.res.setHeader('Set-Cookie', this.authService.getCookiesForLogout());
    }

    @UseGuards(JwtAuthGaurd)
    @Get()
    authenticate(@Req() request: RequestWithUser) {
        const user = request.user;
        user.password = undefined;
        return user;
    }
}