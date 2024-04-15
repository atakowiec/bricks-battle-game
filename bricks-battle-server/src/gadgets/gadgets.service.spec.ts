import { Test, TestingModule } from '@nestjs/testing';
import { GadgetsService } from './gadgets.service';

describe('GadgetsService', () => {
  let service: GadgetsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GadgetsService],
    }).compile();

    service = module.get<GadgetsService>(GadgetsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
