import { Body, Controller, Delete, Get, Inject, NotFoundException, Param, Post, Put, Query, UseGuards, ValidationPipe } from '@nestjs/common';
import { UserRequestDto } from '../dtos';
import { ApiKeyGuard } from '../../auth';
import { iUsersService } from '../services';

// @UseGuards(ApiKeyGuard)
@Controller('users')
export class UsersController {
    constructor(
        @Inject('iUsersService') private readonly usersService: iUsersService
    ) { }
    
    @Post()
    create(@Body(ValidationPipe) userToCreate: UserRequestDto) {
        return this.usersService.createUser(userToCreate);
    }

    @Get()
    findAll(@Query('sort') sort: 'asc' | 'desc' = 'desc') {
        return this.usersService.findAllUsers();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        const user = await this.usersService.findOneUserById(id);

        if (!user) {
            throw new NotFoundException(`User ${id} not found`);
        }

        return user;
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() userToUpdate: UserRequestDto) {
        return this.usersService.updateUserById(id, userToUpdate);
    }

    @Delete(':id')
    deactivate(@Param('id') id: string) {
        // return this.userService.deactivateUserById(id);
    }
}
