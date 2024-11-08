import { Test, TestingModule } from '@nestjs/testing';
import { BlockSectionController } from './section.controller';

describe('BlockSectionController', () => {
  let controller: BlockSectionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BlockSectionController],
    }).compile();

    controller = module.get<BlockSectionController>(BlockSectionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
