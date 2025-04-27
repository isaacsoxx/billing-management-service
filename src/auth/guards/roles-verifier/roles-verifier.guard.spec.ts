import { RolesVerifierGuard } from './roles-verifier.guard';

describe('RolesVerifierGuard', () => {
  it('should be defined', () => {
    expect(new RolesVerifierGuard()).toBeDefined();
  });
});
