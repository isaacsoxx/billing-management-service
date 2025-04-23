import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  ParseEnumPipe,
  Post,
  Put,
  Query,
  Res,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Response } from 'express';
import { JwtAuthGuard, UserRoles } from '../../auth';
import { UserRequestDto } from '../dtos';
import { iUsersService } from '../services';
import { getMessage, MessageType } from '../../common';

@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('api/users')
export class UsersController {
  constructor(
    @Inject('iUsersService') private readonly usersService: iUsersService,
  ) {}

  @Post()
  @ApiOperation({
    summary: getMessage(MessageType.swagger, 'users.summary.create'),
  })
  @ApiResponse({
    status: 201,
    description: getMessage(MessageType.swagger, 'users.success.create'),
  })
  @ApiResponse({
    status: 400,
    description: getMessage(MessageType.swagger, 'users.errors.badRequest'),
  })
  @ApiResponse({
    status: 409,
    description: getMessage(MessageType.swagger, 'users.errors.conflict'),
  })
  async create(
    @Res() res: Response,
    @Body(ValidationPipe) userToCreate: UserRequestDto,
  ) {
    const response = await this.usersService.createUser(userToCreate);
    return res.status(response.statusCode).json(response);
  }

  @Get('')
  @ApiOperation({
    summary: getMessage(MessageType.swagger, 'users.summary.findAllByRole'),
  })
  @ApiResponse({
    status: 202,
    description: getMessage(MessageType.swagger, 'users.success.findAllByRole'),
  })
  @ApiResponse({
    status: 400,
    description: getMessage(MessageType.swagger, 'users.errors.badRequest'),
  })
  async findAllByRole(
    @Res() res: Response,
    @Query('role', new ParseEnumPipe(UserRoles)) role: UserRoles,
  ) {
    const response = await this.usersService.findAllByRole(role);
    return res.status(response.statusCode).json(response);
  }

  @Get(':uuid')
  @ApiOperation({
    summary: getMessage(MessageType.swagger, 'users.summary.findOne'),
  })
  @ApiResponse({
    status: 202,
    description: getMessage(MessageType.swagger, 'users.success.findOne'),
  })
  @ApiResponse({
    status: 400,
    description: getMessage(MessageType.swagger, 'users.errors.badRequest'),
  })
  @ApiResponse({
    status: 404,
    description: getMessage(MessageType.swagger, 'users.errors.notFound'),
  })
  async findOne(@Res() res: Response, @Param('uuid') uuid: string) {
    const response = await this.usersService.findOneUserById(uuid);
    return res.status(response.statusCode).json(response);
  }

  @Put(':uuid')
  @ApiOperation({
    summary: getMessage(MessageType.swagger, 'users.summary.update'),
  })
  @ApiResponse({
    status: 202,
    description: getMessage(MessageType.swagger, 'users.success.update'),
  })
  @ApiResponse({
    status: 400,
    description: getMessage(MessageType.swagger, 'users.errors.badRequest'),
  })
  @ApiResponse({
    status: 404,
    description: getMessage(MessageType.swagger, 'users.errors.notFound'),
  })
  async update(
    @Res() res: Response,
    @Param('uuid') uuid: string,
    @Body() userToUpdate: UserRequestDto,
  ) {
    const response = await this.usersService.updateUserById(uuid, userToUpdate);
    return res.status(response.statusCode).json(response);
  }

  @Post(':sponsorUuid/subscriptions')
  @ApiOperation({
    summary: getMessage(
      MessageType.swagger,
      'users.summary.createSubscription',
    ),
  })
  @ApiResponse({
    status: 201,
    description: getMessage(
      MessageType.swagger,
      'users.success.createSubscription',
    ),
  })
  @ApiResponse({
    status: 400,
    description: getMessage(MessageType.swagger, 'users.errors.badRequest'),
  })
  @ApiResponse({
    status: 404,
    description: getMessage(MessageType.swagger, 'users.errors.notFound', {
      sponsorUuid: 'e328a2b0-8e7f-1dc3-0cc7-b9aed4baa0a2',
    }),
  })
  @ApiResponse({
    status: 409,
    description: getMessage(MessageType.swagger, 'users.errors.conflict'),
  })
  async createSubscription(
    @Param('sponsorUuid') sponsorUuid: string,
    @Res() res: Response,
    @Body(ValidationPipe) userToCreate: UserRequestDto,
  ) {
    const response = await this.usersService.createSubscription(
      sponsorUuid,
      userToCreate,
    );
    return res.status(response.statusCode).json(response);
  }

  @Get(':sponsorUuid/subscriptions')
  @ApiOperation({
    summary: getMessage(
      MessageType.swagger,
      'users.summary.findAllSubscriptions',
    ),
  })
  @ApiResponse({
    status: 202,
    description: getMessage(
      MessageType.swagger,
      'users.success.findAllSubscriptions',
    ),
  })
  @ApiResponse({
    status: 400,
    description: getMessage(MessageType.swagger, 'users.errors.badRequest'),
  })
  @ApiResponse({
    status: 404,
    description: getMessage(MessageType.swagger, 'users.errors.notFound'),
  })
  async findAllSubscriptions(
    @Res() res: Response,
    @Param('sponsorUuid') sponsorUuid: string,
  ) {
    const response =
      await this.usersService.findAllSubscriptionsById(sponsorUuid);
    return res.status(response.statusCode).json(response);
  }
}
