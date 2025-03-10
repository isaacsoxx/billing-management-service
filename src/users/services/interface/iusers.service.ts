import { UserRequestDto } from "src/users/dtos";

export interface iUsersService {
    updateUserById(id: string, userToUpdate: UserRequestDto);
    createUser(userToCreate: UserRequestDto);
    findAllUsers();
    findOneUserById(id: string);
}