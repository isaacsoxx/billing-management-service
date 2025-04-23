import { Test, TestingModule } from '@nestjs/testing';
import { JwtVerificationService } from '../jwt-verification.service';

describe('JwtService', () => {
  let service: JwtVerificationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JwtVerificationService],
    }).compile();

    service = module.get<JwtVerificationService>(JwtVerificationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
