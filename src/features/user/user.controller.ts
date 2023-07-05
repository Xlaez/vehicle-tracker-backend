import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../shared';
import { UserService } from './user.service';
import { UpdateUser } from '../auth';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getme(@Request() req): Promise<any> {
    const user = await this.userService.getUserById(req.user.sub);
    if (!user) throw new NotFoundException('user not found');
    return user;
  }

  @Get(':id')
  //   @UseGuards(JwtAuthGuard)
  async getUserById(@Request() req, @Param('id') id: string): Promise<any> {
    const user = await this.userService.getUserById(id);
    if (!user) throw new NotFoundException('user not found');
    return user;
  }

  @Get('by-username/:username')
  async getUserByUsername(
    @Request() req,
    @Param('username') username: string,
  ): Promise<any> {
    const user = await this.userService.getUserByUsername(username);
    if (!user) throw new NotFoundException('user not found');
    return user;
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  async deleteAccount(@Request() req): Promise<any> {
    this.userService
      .deleteUser(req.user.sub)
      .then((result) => {
        return result;
      })
      .catch((err) => {
        throw new InternalServerErrorException(err);
      });
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  async updateAccountDetails(
    @Request() req,
    @Body() dto: UpdateUser,
  ): Promise<any> {
    return this.userService.updateUser(req.user.sub, dto);
  }
}
