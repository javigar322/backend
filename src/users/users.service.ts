import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateProfileDto } from './dto/create-profile.dto';
import { Profile } from './profile.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Profile) private ProfileRepository: Repository<Profile>,
  ) {}

  getAllUsers() {
    return this.userRepository.find({
      relations: ['posts', 'profile'],
    });
  }

  async getUserById(id: number) {
    const userFound = await this.userRepository.findOne({
      where: {
        id,
      },
      relations: ['posts', 'profile'],
    });
    if (!userFound) {
      return new HttpException('User not found', 404);
    }
    return userFound;
  }

  async createUser(user: CreateUserDto) {
    const userFound = await this.userRepository.findOne({
      where: {
        username: user.username,
      },
    });
    if (userFound) {
      return new HttpException('User already exists', 400);
    }
    const newUser = this.userRepository.create(user);
    return this.userRepository.save(newUser);
  }

  async deleteUser(id: number) {
    const result = await this.userRepository.delete({ id });
    if (result.affected === 0) {
      return new HttpException('User not found', 404);
    }
    return result;
  }

  async updateUser(id: number, user: UpdateUserDto) {
    const result = await this.userRepository.update({ id }, user);
    if (result.affected === 0) {
      return new HttpException('User not found', 404);
    }
    return result;
  }
  async createProfile(id: number, profile: CreateProfileDto) {
    const userFound = await this.userRepository.findOne({ where: { id } });
    if (!userFound) {
      return new HttpException('User not found', 404);
    }

    const newProfile = this.ProfileRepository.create(profile);
    const savedProfile = await this.ProfileRepository.save(newProfile);
    userFound.profile = savedProfile;

    return this.userRepository.save(userFound);
  }
}
