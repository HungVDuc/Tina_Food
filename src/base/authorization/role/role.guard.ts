import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { ROLES_KEY } from './role.decorator';
import { AccessTokenPayload } from '../jwt.interface';
import { UserRole } from 'src/module/user/enums/user.enum';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass,
    ]);

    if (!requiredRoles) return true;

    const request = context.switchToHttp().getRequest();
    const user: AccessTokenPayload = request.user;

    const isMatch = this.matchRoles(requiredRoles, user.role);

    if (!isMatch) throw new ForbiddenException();

    return true;
  }

  private matchRoles(requiredRoles: UserRole[], userRole: UserRole) {
    if (userRole === UserRole.ADMIN) return true;
    return requiredRoles.some((role) => role === userRole);
  }
}
