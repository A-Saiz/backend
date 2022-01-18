import { Body, Controller, Get, HttpCode, Post, Req, Res, UseGuards } from "@nestjs/common";
import { Response } from "express";
import { LocalAuthGaurd } from "src/guards/auth.gaurds";
import JwtAuthGaurd from "src/guards/jwtAuth.gaurd";
import RequestWithUser from "src/interfaces/requestWithUser.interface";
import { RegisterDto } from "../registerDto";
import { AuthService } from "./auth.service";

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) {}

    @Post('register')
    async register(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto);
    }

    @HttpCode(200)
    @UseGuards(LocalAuthGaurd)
    @Post('log-in')
    async login(@Req() request: RequestWithUser, @Res() response: Response) {
        const {user} = request;
        const cookie = this.authService.getCookieWithJwtToken(user.userID);
        response.setHeader('Set-Cookie', cookie);
        user.password = undefined;
        return response.send(user);
    }

    @UseGuards(JwtAuthGaurd)
    @Post('log-out')
    async logout(@Req() request: RequestWithUser, @Res() response: Response) {
        response.setHeader('Set-Cookie', this.authService.getCookieForLogout());
        return response.sendStatus(200);
    }

    @UseGuards(JwtAuthGaurd)
    @Get()
    authenticate(@Req() request: RequestWithUser) {
        const user = request.user;
        user.password = undefined;
        return user;
    }
}