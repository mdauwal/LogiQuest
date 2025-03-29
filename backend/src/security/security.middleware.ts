import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { SecurityService } from './security.service';

@Injectable()
export class SecurityMiddleware implements NestMiddleware {
  constructor(private readonly securityService: SecurityService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const ip = req.ip;

    // Check if IP is blocked
    const isBlocked = await this.securityService.isIpBlocked(ip);
    if (isBlocked) {
      res.status(403).json({ message: 'Access denied' });
      return;
    }

    // Track request
    await this.securityService.trackSuspiciousActivity(
      ip,
      req.method + ' ' + req.path,
    );

    next();
  }
}
