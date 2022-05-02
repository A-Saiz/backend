import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from "../user/entities/user.entity";
import { MysqlDataSource } from 'src/providers/database.provider';
import * as bcrypt from 'bcrypt';

const UserRepository = MysqlDataSource.getRepository(User);

@Injectable()
export class UserService {

  constructor() {}

  async getById(id: number): Promise<User> {
    const user = await UserRepository.findOneBy({userID: id});
    if (user) {
      return user;
    }
    throw new HttpException('User does not exist', HttpStatus.NOT_FOUND);
  }

  async getByEmail(email: string) {
    const user = await UserRepository.findOneBy({email: email});
    if (user) {
      return user;
    }
    throw new HttpException('User does not exist', HttpStatus.NOT_FOUND);
  }

  async create(createUserDto: CreateUserDto) {
    const newUser = UserRepository.create(createUserDto);
    await UserRepository.save(newUser);
    return newUser;
  }

  async findAll(): Promise<User[]> {
    return UserRepository.find();
  }

  async setCurrentRefreshToken(refreshToken: string, userId: number) {
    const currentRefreshToken = bcrypt.hashSync(refreshToken, 10);
    await UserRepository.update(userId, {currentRefreshToken});
  }

  async getUserIfRefreshTokenMatches(refreshToken: string, userId: number) {
    const user = await this.getById(userId);
    const isRefreshTokenMatching = bcrypt.compareSync(refreshToken, user.currentRefreshToken);

    if(isRefreshTokenMatching) {
      return user;
    }
    throw new HttpException('There was a problem logging in', HttpStatus.NOT_ACCEPTABLE);
  }

  async removeRefreshToken(userId: number) {
    return UserRepository.update(userId, {currentRefreshToken: null});
  }

  update(id: number, updateUserDto: UpdateUserDto): string {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
