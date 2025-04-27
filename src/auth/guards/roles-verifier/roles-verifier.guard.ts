import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { iAwsCognitoService } from '../../../auth/services';
import { getMessage, MessageType } from '../../../common';

@Injectable()
export class RolesVerifierGuard implements CanActivate {
  constructor(
    @Inject('iAwsCognitoService')
    private readonly awsCognitoService: iAwsCognitoService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest(),
      user = request.user,
      requiredRoles = this.getRequiredRoles(context);

    if (!user) {
      throw new NotFoundException(
        getMessage(MessageType.app, 'auth.errors.notFound'),
      );
    }

    const authAttributes = await this.awsCognitoService.getAuthAttributes(
      user.sub,
    );

    if (!requiredRoles.includes(authAttributes.role)) {
      throw new UnauthorizedException(
        getMessage(MessageType.app, 'auth.errors.forbidden'),
      );
    }
    return true;
  }

  private getRequiredRoles(context: ExecutionContext): string[] {
    const roles = Reflect.getMetadata('roles', context.getHandler());

    return !roles ? [] : roles;
  }
}
