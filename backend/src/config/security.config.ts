import { registerAs } from '@nestjs/config';

export default registerAs('security', () => ({
  rateLimit: {
    global: {
      points: 100,
      duration: 60,
    },
    sensitive: {
      points: 10,
      duration: 60,
    },
  },
  securityHeaders: {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'"],
        imgSrc: ["'self'"],
      },
    },
  },
}));
