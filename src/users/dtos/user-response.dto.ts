import { Expose } from 'class-transformer';

export class UserReponseDto {
  @Expose()
  uuid: string;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  isActive: boolean;
}
