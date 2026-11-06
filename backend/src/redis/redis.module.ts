import { Logger, Module } from '@nestjs/common';
import Redis from 'ioredis';
import 'dotenv';

@Module({
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: () => {
        const client = process.env.REDIS_URL
          ? new Redis(process.env.REDIS_URL)
          : new Redis({
            host: process.env.REDIS_HOST || process.env.REDIS || '127.0.0.1',
            port: Number(process.env.REDIS_PORT) || 6379,
          });

        client.on('error', (error: Error) => {
          Logger.error(
            `Redis connection failed: ${error.message}`,
            'RedisModule',
          );
        });

        return client;
      },
    },
  ],
  exports: ['REDIS_CLIENT'],
})
export class RedisModule { }
