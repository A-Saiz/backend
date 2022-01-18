import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from "../user/entities/user.entity";
import { Repository, getConnection } from "typeorm";

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

  update(id: number, updateUserDto: UpdateUserDto): string {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
