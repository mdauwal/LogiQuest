import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { SecurityService } from './security.service';

@Injectable()
export class SecurityGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly securityService: SecurityService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const ip = request.ip;

    // Check if IP is blocked
    const isBlocked = await this.securityService.isIpBlocked(ip);
    if (isBlocked) {
      return false;
    }

    // Track request
    await this.securityService.trackSuspiciousActivity(
      ip,
      request.method + ' ' + request.path,
    );

    return true;
  }
}
