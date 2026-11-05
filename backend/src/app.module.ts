import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ApiService } from './api/api.service';
import { ApiController } from './api/api.controller';
import { ApiModule } from './api/api.module';
import { JwtStrategy } from './auth/jwt.strategy';
import { JWT_SECRET } from './auth/jwt.constants';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [
    PrismaModule,
    ApiModule,
    PassportModule,
    JwtModule.register({
      secret: JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
    RedisModule,
  ],
  controllers: [AppController, ApiController],
  providers: [AppService, ApiService, JwtStrategy],
})
export class AppModule {}
