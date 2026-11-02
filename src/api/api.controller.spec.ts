import { Test, TestingModule } from '@nestjs/testing';
import { ApiController } from './api.controller';
import { ApiService } from './api.service';

describe('ApiController', () => {
  let controller: ApiController;
  const apiService = {
    getImages: jest.fn(),
    getImageById: jest.fn(),
    createUser: jest.fn(),
    createEvent: jest.fn(),
    getInterests: jest.fn(),
    getFeed: jest.fn(),
    topCategories: jest.fn(),
    viewsPerDay: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApiController],
      providers: [{ provide: ApiService, useValue: apiService }],
    }).compile();

    controller = module.get<ApiController>(ApiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
