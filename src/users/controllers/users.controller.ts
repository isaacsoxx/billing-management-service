import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Query,
  Res,
  ValidationPipe,
} from '@nestjs/common';
import { UserRequestDto } from '../dtos';
import { iUsersService } from '../services';
import { Response } from 'express';

// @UseGuards(ApiKeyGuard)
@Controller('users')
export class UsersController {
  constructor(
    @Inject('iUsersService') private readonly usersService: iUsersService,
  ) {}

  @Post()
  async create(
    @Res() res: Response,
    @Body(ValidationPipe) userToCreate: UserRequestDto,
  ) {
    const response = await this.usersService.createUser(userToCreate);
    return res.status(response.statusCode).json(response);
  }

  @Get()
  async findAll(
    @Res() res: Response,
    @Query('sort') sort: 'asc' | 'desc' = 'desc',
  ) {
    const response = await this.usersService.findAllUsers();
    res.status(response.statusCode).json(response);
  }

  @Get(':id')
  async findOne(@Res() res: Response, @Param('id') id: string) {
    const response = await this.usersService.findOneUserById(id);
    return res.status(response.statusCode).json(response);
  }

  @Put(':id')
  async update(
    @Res() res: Response,
    @Param('id') id: string,
    @Body() userToUpdate: UserRequestDto,
  ) {
    const response = await this.usersService.updateUserById(id, userToUpdate);
    res.status(response.statusCode).json(response);
  }

  @Delete(':id')
  deactivate(@Param('id') id: string) {
    // return this.userService.deactivateUserById(id);
  }
}
