import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ApiService } from './api.service';
import { PrismaService } from '../prisma/prisma.service';

describe('ApiService', () => {
  let service: ApiService;
  const prisma = {
    user: { findUnique: jest.fn() },
    userInterest: { findMany: jest.fn() },
    image: { findMany: jest.fn() },
  };
  const redis = {
    get: jest.fn(),
    set: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApiService,
        { provide: PrismaService, useValue: prisma },
        {
          provide: JwtService,
          useValue: { signAsync: jest.fn().mockResolvedValue('token') },
        },
        { provide: 'REDIS_CLIENT', useValue: redis },
      ],
    }).compile();

    service = module.get<ApiService>(ApiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('returns a cached feed without querying the database', async () => {
    const cachedFeed = [{ id: 1, category: 'sports' }];
    redis.get.mockResolvedValue(JSON.stringify(cachedFeed));

    await expect(service.getFeed(42)).resolves.toEqual(cachedFeed);
    expect(prisma.user.findUnique).not.toHaveBeenCalled();
    expect(redis.set).not.toHaveBeenCalled();
  });

  it('caches a newly generated feed for five minutes', async () => {
    const feed = [
      { id: 1, category: 'sports' },
      { id: 2, category: 'news' },
    ];
    redis.get.mockResolvedValue(null);
    prisma.user.findUnique.mockResolvedValue({ id: 42 });
    prisma.userInterest.findMany.mockResolvedValue([
      { category: 'sports', score: 10 },
    ]);
    prisma.image.findMany.mockResolvedValue(feed);

    await expect(service.getFeed(42)).resolves.toEqual(feed);
    expect(redis.set).toHaveBeenCalledWith(
      'feed:42',
      JSON.stringify(feed),
      'EX',
      300,
    );
  });
});
