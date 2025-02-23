import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateProfileDto } from './dto/update-profile-dto.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  private users = [];

  async getProfile(userId: string) {
    const user = this.users.find((u) => u.id === userId);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const user = this.users.find((u) => u.id === userId);
    if (!user) throw new NotFoundException('User not found');

    Object.assign(user, dto);
    return { message: 'Profile updated successfully', user };
  }

  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = this.users.find((u) => u.id === userId);
    if (!user) throw new NotFoundException('User not found');

    const isMatch = await bcrypt.compare(dto.oldPassword, user.password);
    if (!isMatch) throw new ForbiddenException('Incorrect old password');

    user.password = await bcrypt.hash(dto.newPassword, 10);
    return { message: 'Password updated successfully' };
  }

  async deactivateAccount(userId: string) {
    const userIndex = this.users.findIndex((u) => u.id === userId);
    if (userIndex === -1) throw new NotFoundException('User not found');

    this.users.splice(userIndex, 1);
    return { message: 'Account deactivated successfully' };
  }

  async getAllUsers() {
    return this.users;
  }

  async getUserById(userId: string) {
    const user = this.users.find((u) => u.id === userId);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async deleteUser(userId: string) {
    const userIndex = this.users.findIndex((u) => u.id === userId);
    if (userIndex === -1) throw new NotFoundException('User not found');

    this.users.splice(userIndex, 1);
    return { message: 'User deleted successfully' };
  }
}
