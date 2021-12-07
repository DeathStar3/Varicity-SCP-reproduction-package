import { Test, TestingModule } from '@nestjs/testing';
import { DbFacadeService } from './db-facade.service';

describe('DbFacadeService', () => {
  let service: DbFacadeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DbFacadeService],
    }).compile();

    service = module.get<DbFacadeService>(DbFacadeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
