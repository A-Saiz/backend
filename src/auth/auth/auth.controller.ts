import { Body, Controller, Get, HttpCode, Post, Req, UseGuards } from "@nestjs/common";
import { Response } from "express";
import { LocalAuthGaurd } from "src/guards/auth.gaurds";
import JwtAuthGaurd from "src/guards/jwtAuth.gaurd";
import RequestWithUser from "src/interfaces/requestWithUser.interface";
import { SETTINGS } from "src/utils/app.utils";
import { RegisterDto } from "../registerDto";
import { AuthService } from "./auth.service";

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
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
        request.res.setHeader('Set-Cookie', cookie);
        user.password = undefined;
        return user;
    }

    @UseGuards(JwtAuthGaurd)
    @Post('log-out')
    async logout(@Req() request: RequestWithUser) {
        request.res.setHeader('Set-Cookie', this.authService.getCookieForLogout());
        return request.res.sendStatus(200);
    }

    @UseGuards(JwtAuthGaurd)
    @Get()
    authenticate(@Req() request: RequestWithUser) {
        const user = request.user;
        user.password = undefined;
        return user;
    }
}