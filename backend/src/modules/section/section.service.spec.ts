import { Test, TestingModule } from '@nestjs/testing';
import { BlockSectionService } from './section.service';

describe('BlockSectionService', () => {
   let service: BlockSectionService;

   beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
         providers: [BlockSectionService],
      }).compile();

      service = module.get<BlockSectionService>(BlockSectionService);
   });

   it('should be defined', () => {
      expect(service).toBeDefined();
   });
});
