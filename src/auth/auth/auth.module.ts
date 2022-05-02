import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from 'src/strategies/jwt.strategy';
import { LocalStrategy } from 'src/strategies/local.strategy';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    UserModule,
    PassportModule.register({defaultStrategy: 'jwt'}),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory:async (configService:ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {expiresIn: `${configService.get('JWT_EXPIRATION_TIME')}s`},
      })
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    })
  ],
  providers: [
    AuthService,
    UserService,
    LocalStrategy,
    JwtStrategy
  ],
  controllers: [
    AuthController
  ],
  exports: [
    PassportModule,
    JwtModule
  ]
})
export class AuthModule {}
