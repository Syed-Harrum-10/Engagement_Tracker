import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import Redis from 'ioredis';

@Injectable()
export class ApiService {
  private readonly salt = 10;

  constructor(
    private readonly Client: PrismaService,
    private readonly jwtService: JwtService,
    @Inject('REDIS_CLIENT') private readonly redisClient: Redis,
  ) {}

  // IMAGES
  async getImages(category?: string) {
    return this.Client.image.findMany({
      where: category ? { category } : undefined,
    });
  }

  async getImageById(id: number) {
    const image = await this.Client.image.findUnique({ where: { id } });
    if (!image) throw new NotFoundException('Image not found');
    return image;
  }

  // USERS
  async createUser(name: string, password: string, email: string) {
    const normalizedEmail = email.toLowerCase();
    const existing = await this.Client.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existing) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, this.salt);
    const createdUser = await this.Client.user.create({
      data: {
        name,
        password: hashedPassword,
        email: normalizedEmail,
      },
    });

    return {
      user: {
        id: createdUser.id,
        name: createdUser.name,
        email: createdUser.email,
        createdAt: createdUser.createdAt,
      },
    };
  }

  async login(email: string, password: string) {
    const normalizedEmail = email.toLowerCase();
    const existingUser = await this.Client.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!existingUser) {
      throw new UnauthorizedException('Email or Password is Incorrect');
    }

    const passwordMatches = await bcrypt.compare(
      password,
      existingUser.password,
    );
    if (!passwordMatches) {
      throw new UnauthorizedException('Email or Password is Incorrect');
    }

    const payload = {
      sub: existingUser.id,
      name: existingUser.name,
      email: existingUser.email,
    };

    const token = await this.jwtService.signAsync(payload);

    return {
      accessToken: token,
      user: {
        id: existingUser.id,
        name: existingUser.name,
        email: existingUser.email,
      },
    };
  }

  // EVENTS
  async createEvent(userId: number, imageId: number, dwellSeconds: number) {
    if (dwellSeconds < 5) {
      return { saved: false, message: 'View too short, not counted' };
    }

    const user = await this.Client.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const image = await this.Client.image.findUnique({
      where: { id: imageId },
    });
    if (!image) throw new NotFoundException('Image not found');

    await this.Client.$transaction([
      this.Client.event.create({ data: { userId, imageId, dwellSeconds } }),
      this.Client.userInterest.upsert({
        where: { userId_category: { userId, category: image.category } },
        update: { score: { increment: dwellSeconds } },
        create: { userId, category: image.category, score: dwellSeconds },
      }),
    ]);

    await this.redisClient.del(`feed:${userId}`);
    return { saved: true };
  }

  // INTERESTS
  async getInterests(userId: number) {
    const user = await this.Client.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    return this.Client.userInterest.findMany({
      where: { userId },
      orderBy: { score: 'desc' },
      select: { category: true, score: true },
    });
  }

  // FEED
  async getFeed(userId: number) {
    const key = `feed:${userId}`;
    const cached = await this.redisClient.get(key);
    if (cached) {
      console.log('cache hit');
      const cachedFeed: unknown = JSON.parse(cached);
      return cachedFeed;
    }

    console.log('cache miss');

    const user = await this.Client.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const interests = await this.Client.userInterest.findMany({
      where: { userId },
      select: { category: true, score: true },
    });
    const scores = new Map(interests.map((i) => [i.category, i.score]));

    const images = await this.Client.image.findMany();
    const feed = images.sort(
      (a, b) => (scores.get(b.category) ?? 0) - (scores.get(a.category) ?? 0),
    );
    await this.redisClient.set(key, JSON.stringify(feed), 'EX', 300);
    return feed;
  }

  // ANALYTICS
  async topCategories() {
    const rows = await this.Client.$queryRaw<
      { category: string; total: bigint }[]
    >`
      SELECT i."category", SUM(e."dwellSeconds") AS total
      FROM "Event" e
      JOIN "Image" i ON i."id" = e."imageId"
      GROUP BY i."category"
      ORDER BY total DESC`;
    return rows.map((r) => ({
      category: r.category,
      totalSeconds: Number(r.total),
    }));
  }

  async viewsPerDay() {
    const rows = await this.Client.$queryRaw<{ day: Date; views: bigint }[]>`
      SELECT DATE("createdAt") AS day, COUNT(*) AS views
      FROM "Event"
      GROUP BY day
      ORDER BY day`;
    return rows.map((r) => ({ day: r.day, views: Number(r.views) }));
  }
}
