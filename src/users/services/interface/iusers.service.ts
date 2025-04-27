import { UserRoles } from '../../../auth';
import { ApiResponseDto } from '../../../common';
import { UsersResponseDto, UserRequestDto } from '../..';

export interface iUsersService {
  createUser(userToCreate: UserRequestDto): Promise<ApiResponseDto<string>>;
  updateUserById(
    uuid: string,
    userToUpdate: UserRequestDto,
  ): Promise<ApiResponseDto<null>>;
  findOneUserById(
    uuid: string,
  ): Promise<ApiResponseDto<UsersResponseDto | null>>;

  createSubscription(
    sponsorId: string,
    userToCreate: UserRequestDto,
  ): Promise<ApiResponseDto<string>>;
  findAllSubscriptionsById(
    sponsorId: string,
  ): Promise<ApiResponseDto<UsersResponseDto[]>>;
  findAllByRole(role: UserRoles): Promise<ApiResponseDto<UsersResponseDto[]>>;
}
