import {
  ConflictException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { randomUUID } from 'crypto';
import { iUsersService } from '.';
import { UserResponseDto as UserResponseDto, UserRequestDto } from '..';
import { ApiResponseDto, getMessage, MessageType } from '../../common';
import { iUsersRepository } from '../repository';
import { Users } from '../entities';
import { iAwsCognitoService, UserRoles } from '../../auth';

@Injectable()
export class UsersService implements iUsersService {
  constructor(
    @Inject('iUsersRepository')
    private readonly usersRepository: iUsersRepository,
    @Inject('iAwsCognitoService')
    private readonly awsCognitoService: iAwsCognitoService,
  ) {}

  async createUser(
    userToCreate: UserRequestDto,
  ): Promise<ApiResponseDto<string>> {
    try {
      const userResource = new Users(userToCreate);
      userResource.uuid = randomUUID();

      await this.awsCognitoService.registerUser(userResource);

      const result = await this.usersRepository.createUser(userResource);

      if (result instanceof Users) {
        return ApiResponseDto.createSuccess(
          HttpStatus.CREATED,
          getMessage(MessageType.app, 'users.success.created'),
          result.uuid,
        );
      }
      throw new ConflictException(
        getMessage(MessageType.app, 'users.errors.conflict'),
      );
    } catch (error) {
      throw error;
    }
  }

  async updateUserById(
    uuid: string,
    userToUpdate: UserRequestDto,
  ): Promise<ApiResponseDto<null>> {
    const resourceFound = await this.usersRepository.findOneUserById(uuid);

    if (resourceFound) {
      Object.assign(resourceFound, userToUpdate);
      const result = await this.usersRepository.updateUserById(resourceFound);
      return ApiResponseDto.createSuccess(
        HttpStatus.ACCEPTED,
        getMessage(MessageType.app, 'users.success.updated', {
          count: result.affected,
        }),
      );
    }

    throw new NotFoundException(
      getMessage(MessageType.app, 'users.errors.notFound', { uuid }),
    );
  }

  async findOneUserById(
    uuid: string,
  ): Promise<ApiResponseDto<UserResponseDto | null>> {
    const result = await this.usersRepository.findOneUserById(uuid);

    if (result) {
      return ApiResponseDto.createSuccess(
        HttpStatus.ACCEPTED,
        '',
        plainToInstance(UserResponseDto, result, {
          excludeExtraneousValues: true,
        }),
      );
    }

    throw new NotFoundException(
      getMessage(MessageType.app, 'users.errors.notFound', { uuid }),
    );
  }

  async createSubscription(
    sponsorUuid: string,
    userToCreate: UserRequestDto,
  ): Promise<ApiResponseDto<string>> {
    const sponsorFound =
      await this.usersRepository.findOneUserById(sponsorUuid);

    if (sponsorFound) {
      const subscriptionResource = new Users(userToCreate);
      subscriptionResource.uuid = randomUUID();
      subscriptionResource.sponsor = sponsorUuid;
      const result =
        await this.usersRepository.createUser(subscriptionResource);

      if (result instanceof Users) {
        return ApiResponseDto.createSuccess(
          HttpStatus.CREATED,
          getMessage(MessageType.app, 'users.success.created'),
          result.uuid,
        );
      }

      throw new ConflictException(
        getMessage(MessageType.app, 'users.errors.conflict'),
      );
    }

    throw new NotFoundException(
      getMessage(MessageType.app, 'users.errors.notFound', {
        uuid: sponsorUuid,
      }),
    );
  }

  async findAllSubscriptionsById(
    sponsorId: string,
  ): Promise<ApiResponseDto<UserResponseDto[]>> {
    const resourceFound = await this.usersRepository.findOneUserById(sponsorId);

    if (resourceFound) {
      const result =
        await this.usersRepository.findAllSubscriptionsById(sponsorId);
      return ApiResponseDto.createSuccess(
        HttpStatus.ACCEPTED,
        '',
        plainToInstance(UserResponseDto, result, {
          excludeExtraneousValues: true,
        }),
      );
    }

    throw new NotFoundException(
      getMessage(MessageType.app, 'users.errors.notFound'),
    );
  }

  async findAllByRole(
    role: UserRoles,
  ): Promise<ApiResponseDto<UserResponseDto[]>> {
    const result = await this.usersRepository.findAllByRole(role);
    return ApiResponseDto.createSuccess(
      HttpStatus.ACCEPTED,
      '',
      plainToInstance(UserResponseDto, result, {
        excludeExtraneousValues: true,
      }),
    );
  }
}
