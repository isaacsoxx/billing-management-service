import { UserRoles } from '..';

export interface AuthAttributesDto {
  uuid: string;
  role: UserRoles;
}
