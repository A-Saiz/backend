import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from "../user/entities/user.entity";
import { Repository } from "typeorm";
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {

  constructor(
    @Inject('USER_REPO')
    private userRepo: Repository<User>
  ) {}

  async getById(id: number) {
    const user = await this.userRepo.findOne(id);
    if (user) {
      return user;
    }
    throw new HttpException('User does not exist', HttpStatus.NOT_FOUND);
  }

  async getByEmail(email: string) {
    const user = await this.userRepo.findOne({email});
    if (user) {
      return user;
    }
    throw new HttpException('User does not exist', HttpStatus.NOT_FOUND);
  }

  async create(createUserDto: CreateUserDto) {
    const newUser = this.userRepo.create(createUserDto);
    await this.userRepo.save(newUser);
    return newUser;
  }

  async findAll(): Promise<User[]> {
    return this.userRepo.find();
  }

   async findOne(id: number): Promise<User | undefined> {
    const user = await this.userRepo.findOne(id);
    return user;
  }

  async setCurrentRefreshToken(refreshToken: string, userId: number) {
    const currentRefreshToken = bcrypt.hashSync(refreshToken, 10);
    await this.userRepo.update(userId, {currentRefreshToken});
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
    return this.userRepo.update(userId, {currentRefreshToken: null});
  }

  update(id: number, updateUserDto: UpdateUserDto): string {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
