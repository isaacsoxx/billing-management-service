export interface iJwtVerificationService {
  verifyToken(token: string): Promise<Record<string, any>>;
}
