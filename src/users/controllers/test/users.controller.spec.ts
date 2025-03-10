import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common/exceptions';
import { UsersController } from '../users.controller';
import { UsersService } from '../../services/users.service';
import { UserRequestDto } from '../../dtos';
import { Users } from '../../entities';

describe('UsersController', () => {
  let controller: UsersController;
  const mockUpdateUserById = jest.fn();
  const mockFindOneUserById = jest.fn();
  const mockCreateUser = jest.fn();

  const mockService = {
    createUser: mockCreateUser,
    updateUserById: mockUpdateUserById,
    findOneUserById:  mockFindOneUserById
  }

  beforeEach(async () => {
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{provide: UsersService, useValue: mockService}]
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('when user is created', () => {
    const userCreateMockResult: Users = {id: '1', firstName: 'First Name', lastName: 'Last Name', isActive: true};
    const userCreateMockDto: UserRequestDto = {firstName: 'First Name', lastName: 'Last Name', createdAt: new Date()};
    
    beforeEach(() => {
      mockCreateUser.mockResolvedValue(userCreateMockResult);
    });

    it('should return created user', async() => {
      const result = await controller.create(userCreateMockDto);
      expect(result.id).toEqual(userCreateMockResult.id);
      expect(result.firstName).toEqual(userCreateMockResult.firstName);
      expect(result.lastName).toEqual(userCreateMockResult.lastName);
      expect(result.isActive).toEqual(userCreateMockResult.isActive);
    });
  });

  describe('when user is updated', () => {
    const userMockId: string = '2';
    const userMockResult: Users = {id: userMockId, firstName: 'First Name', lastName: 'Last Name', isActive: true};
    const userUpdateMockDto: UserRequestDto = {firstName: 'New First Name', lastName: 'New Last Name', createdAt: new Date()};
    const userUpdatedMockResult: Users = {...userMockResult, firstName: userUpdateMockDto.firstName, lastName: userUpdateMockDto.lastName, isActive: false};
    
    beforeEach(() => {
      mockUpdateUserById.mockResolvedValue(userUpdatedMockResult);
    });

    it('should return updated user', async() => {
      const result = await controller.update(userMockId, userUpdateMockDto);
      expect(result?.id).toEqual(userUpdatedMockResult.id);
      expect(result?.firstName).toEqual(userUpdatedMockResult.firstName);
      expect(result?.lastName).toEqual(userUpdatedMockResult.lastName);
      expect(result?.isActive).toEqual(userUpdatedMockResult.isActive);
    });
  });

  describe('Find One By Id', () => {
    describe('when user is found', () => {
      const userMockId: string = '2';
      const userMockResult: Users = {id: userMockId, firstName: 'First Name', lastName: 'Last Name', isActive: true};
  
      beforeEach(() => {
        mockFindOneUserById.mockResolvedValue(userMockResult);
      });
  
      it('should return one found user', async() => {
        const result = await controller.findOne(userMockId);
        expect(result?.id).toEqual(userMockResult.id);
        expect(result?.firstName).toEqual(userMockResult.firstName);
        expect(result?.lastName).toEqual(userMockResult.lastName);
        expect(result?.isActive).toEqual(userMockResult.isActive);
      });
    });

    describe('when user is not found', () => {
      const userMockId = '1';

      
      beforeEach(() => {
        mockFindOneUserById.mockResolvedValue(null);
      });

      it('should throw an exception message', async() => {
        await expect(controller.findOne(userMockId)).rejects.toThrow(`User ${userMockId} not found`);
      });

      it('should throw 404 not found exception', async() => {
        await expect(controller.findOne(userMockId)).rejects.toBeInstanceOf(NotFoundException);
      });
    });
  });
});
