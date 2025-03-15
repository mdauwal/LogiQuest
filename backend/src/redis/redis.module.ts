import { Module, DynamicModule } from '@nestjs/common';
import { RedisModule } from '@nestjs-modules/ioredis';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({})
export class RedisConfigModule {
  static register(): DynamicModule {
    // Check environment at module load time
    const redisEnabled = process.env.REDIS_ENABLED === 'true';

    if (!redisEnabled) {
      console.log('Redis is disabled. Some features may have limited functionality.');
      
      // Return empty module when Redis is disabled
      return {
        module: RedisConfigModule,
        exports: [],
      };
    }
    
    // Return actual Redis module when enabled
    return {
      module: RedisConfigModule,
      imports: [
        RedisModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => ({
            type: 'single',
            url: configService.get<string>('REDIS_URL', 'redis://localhost:6379'),
            connectTimeout: 10000,
            retryStrategy: (times) => Math.min(times * 50, 2000),
          }),
        }),
      ],
      exports: [RedisModule],
    };
  }
}