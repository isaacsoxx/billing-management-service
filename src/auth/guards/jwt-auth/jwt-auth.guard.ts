import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { iJwtVerificationService } from '../..';
import { getMessage, MessageType } from 'src/common';

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
      throw new UnauthorizedException(
        getMessage(MessageType.app, 'auth.errors.missingHeaderUnauthorized'),
      );
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException(
        getMessage(MessageType.app, 'auth.errors.missingTokenUnauthorized'),
      );
    }

    const decodedToken = await this.jwtVerificationService.verifyToken(token);
    request.user = decodedToken;
    return true;
  }
}
