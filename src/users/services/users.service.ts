import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import {
  ApiResponseDto,
  UserReponseDto as UserResponseDto,
  UserRequestDto,
} from '../dtos';
import { iUsersService } from '.';
import { iUsersRepository } from '../repository';
import { Users } from '../entities';
import { randomUUID } from 'crypto';
import { plainToInstance } from 'class-transformer';
import { AuthRegisterUserRequestDto, iAwsCognitoService } from '../../auth';

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
    const userResource = new Users(userToCreate);
    userResource.uuid = randomUUID();

    const result = await this.usersRepository.createUser(userResource);

    if (result instanceof Users) {
      const authRegisterUserData: AuthRegisterUserRequestDto = {
        phoneNumber: userResource.phoneNumber,
        firstName: userResource.firstName,
        password: userResource.uuid,
      };
      const signUpResult =
        await this.awsCognitoService.registerUser(authRegisterUserData);

      console.log(signUpResult);

      return new ApiResponseDto(
        HttpStatus.CREATED,
        'Resource created.',
        result.uuid,
      );
    }

    return new ApiResponseDto(HttpStatus.CONFLICT, 'Error creating user.');
  }

  async updateUserById(
    uuid: string,
    userToUpdate: UserRequestDto,
  ): Promise<ApiResponseDto<null>> {
    const resourceFound = await this.usersRepository.findOneUserById(uuid);

    if (resourceFound) {
      Object.assign(resourceFound, userToUpdate);
      const result = await this.usersRepository.updateUserById(resourceFound);
      return new ApiResponseDto(
        HttpStatus.ACCEPTED,
        `${result.affected} resource(s) updated.`,
      );
    }

    return new ApiResponseDto(
      HttpStatus.NOT_FOUND,
      `User with uuid ${uuid} was not found.`,
    );
  }

  async findAllUsers(): Promise<ApiResponseDto<UserResponseDto[]>> {
    const result = await this.usersRepository.findAllUsers();
    return new ApiResponseDto(
      HttpStatus.ACCEPTED,
      '',
      plainToInstance(UserResponseDto, result, {
        excludeExtraneousValues: true,
      }),
    );
  }

  async findOneUserById(
    uuid: string,
  ): Promise<ApiResponseDto<UserResponseDto | null>> {
    const result = await this.usersRepository.findOneUserById(uuid);

    if (!result) {
      return new ApiResponseDto(
        HttpStatus.NOT_FOUND,
        `User with uuid ${uuid} was not found`,
        null,
        false,
      );
    }

    return new ApiResponseDto(
      HttpStatus.ACCEPTED,
      '',
      plainToInstance(UserResponseDto, result, {
        excludeExtraneousValues: true,
      }),
    );
  }
}
