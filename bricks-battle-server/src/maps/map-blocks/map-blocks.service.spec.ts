import { Test, TestingModule } from '@nestjs/testing';
import { MapBlocksService } from './map-blocks.service';

describe('MapBlocksService', () => {
  let service: MapBlocksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MapBlocksService],
    }).compile();

    service = module.get<MapBlocksService>(MapBlocksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
