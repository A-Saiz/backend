import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AuthModule } from 'src/auth/auth/auth.module';

@Module({
  imports: [
    forwardRef(() => AuthModule)
  ],
  controllers: [UserController],
  providers: [
    UserService
  ]
})
export class UserModule {}
