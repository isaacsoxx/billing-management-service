import { ApiResponseDto, UserReponseDto, UserRequestDto } from 'src/users/dtos';

export interface iUsersService {
  createUser(userToCreate: UserRequestDto): Promise<ApiResponseDto<string>>;
  updateUserById(
    uuid: string,
    userToUpdate: UserRequestDto,
  ): Promise<ApiResponseDto<null>>;
  findAllUsers(): Promise<ApiResponseDto<UserReponseDto[]>>;
  findOneUserById(uuid: string): Promise<ApiResponseDto<UserReponseDto | null>>;
}
