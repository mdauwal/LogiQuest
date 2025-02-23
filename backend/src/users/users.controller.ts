import {
  Controller,
  Get,
  Patch,
  Body,
  UseGuards,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { UpdateProfileDto } from './dto/update-profile-dto.dto';
import { User } from 'src/auth/common/decorator/get-user.decorator';
import { ChangePasswordDto } from './dto/change-password.dto';

@Controller('users')
export class UserController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  getProfile(@User() user) {
    return this.usersService.getProfile(user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('profile')
  updateProfile(@User() user, @Body() dto: UpdateProfileDto) {
    return this.usersService.updateProfile(user.id, dto);
  }
}
