import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { RegisterDto } from '../registerDto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {

    constructor(
        @Inject(forwardRef(() => UserService))
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService
    ) {}

    /**
     * Registers a new user. If user exists it will throw bad request
     * @param registerDto Credentials to register
     * @returns New registered user
     */
    public async register(registerDto: RegisterDto) {
        const saltOrRounds = bcrypt.genSaltSync(10);
        const hashPassword = bcrypt.hashSync(registerDto.password, saltOrRounds);
        try {
            const createdUser = await this.userService.create({
                ...registerDto,
                password: hashPassword
            });
            //TODO: Clean up later
            //createdUser.password = undefined;
            return createdUser;
        } catch (error) {
            //TODO: Catch more specific error handling
            if (error) {
                throw new HttpException('User with that email already exists', HttpStatus.BAD_REQUEST);
            }
        }
    }

    /**
     * Gets user if the passwords match
     * @param email User email
     * @param password Password to compare
     * @returns User
     */
    public async getAuthenticatedUser(email: string, password: string) {
        try {
            const user = await this.userService.getByEmail(email);
            await this.verifyPassword(password, user.password);
            //user.password = undefined;
            return user;
        } catch (error) {
            throw new HttpException('Incorrect credentials', HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * Verifies password for user
     * @param password password from input to compare
     * @param hashedPassword password in db to compare
     */
    private async verifyPassword(password: string, hashedPassword: string) {
        const isPasswordMatching = await bcrypt.compare(password, hashedPassword);
        if (!isPasswordMatching) {
            throw new HttpException('Incorrect credentials', HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * Deletes cookies when logging user out
     * @returns nothing :)
     */
    public getCookiesForLogout() {
        return [
            'Authentication=; HttpOnly; Path=/; Max-Age=0',
            'Refresh=; HttpOnly; Path=/; Max-Age=0'
          ];

    }

    /**
     * Saves token as cookie for logged in user
     * @param userId User that logs in
     * @returns Jwt token to check for authentication
     */
     public getCookieWithJwtToken(userId: number) {
        const payload: TokenPayload = {userId};
        const token = this.jwtService.signAsync(payload, {
            secret: this.configService.get('JWT_SECRET'),
            expiresIn: `${this.configService.get('JWT_EXPIRATION_TIME')}s`
        });
        return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get('JWT_EXPIRATION_TIME')}`;
    }

    public getCookieWithRefreshToken(userId: number) {
        const payload: TokenPayload = {userId};
        const token = this.jwtService.sign(payload, {
            secret: this.configService.get('JWT_REFRESH_SECRET'),
            expiresIn: `${this.configService.get('JWT_EXPIRATION_TIME')}s`
          });
          return `Refresh=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get('JWT_REFRESH_EXPIRATION_TIME')}`;
    }
}
