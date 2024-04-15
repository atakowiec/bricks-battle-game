import { Test, TestingModule } from '@nestjs/testing';
import { GadgetsController } from './gadgets.controller';

describe('GadgetsController', () => {
  let controller: GadgetsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GadgetsController],
    }).compile();

    controller = module.get<GadgetsController>(GadgetsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
