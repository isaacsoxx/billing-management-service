import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Query,
  Req,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { iAwsCognitoService } from 'src/auth';
import { TrustDeviceRequestDto } from '../../auth/dtos/trust-device-request.dto';

@ApiBearerAuth('access-token')
@Controller('api/auth')
export class AuthController {
  constructor(
    @Inject('iAwsCognitoService')
    private readonly cognitoService: iAwsCognitoService,
  ) {}

  @Post('register-trust-device')
  async createTrustDevice(
    @Req() req: Request,
    @Body(ValidationPipe) trustDeviceRequest: TrustDeviceRequestDto,
  ) {
    const token = req.headers['authorization'].split(' ')[1] || '';
    return await this.cognitoService.registerTrustedDevice(
      trustDeviceRequest,
      token,
    );
  }

  @Get('get-trusted-devices/:userSub')
  async getTrustedDevices(
    @Req() req: Request,
    @Param('userSub') userSub: string,
  ) {
    return await this.cognitoService.getUserTrustedDevices(userSub);
  }
}
