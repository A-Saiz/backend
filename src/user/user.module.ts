import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { DatabaseModule } from 'src/modules/database/database.module';
import { userProvider } from 'src/providers/user.provider';

@Module({
  imports: [DatabaseModule],
  controllers: [UserController],
  providers: [
    ...userProvider,
    UserService
  ]
})
export class UserModule {}
