import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { iJwtVerificationService } from '../..';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    @Inject('iJwtVerificationService')
    private readonly jwtVerificationService: iJwtVerificationService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];
    if (!authHeader) {
      throw new UnauthorizedException('Authorization header is missing.');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Token was not provided.');
    }

    const decodedToken = await this.jwtVerificationService.verifyToken(token);
    request.user = decodedToken;
    return true;
  }
}
