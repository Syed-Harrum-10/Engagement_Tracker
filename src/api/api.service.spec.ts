import { Test, TestingModule } from '@nestjs/testing';
import { ApiService } from './api.service';
import { PrismaService } from '../prisma/prisma.service';

describe('ApiService', () => {
  let service: ApiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ApiService, { provide: PrismaService, useValue: {} }],
    }).compile();

    service = module.get<ApiService>(ApiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
