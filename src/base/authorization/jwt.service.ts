import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AccessTokenPayload } from './jwt.interface';

@Injectable()
export class JwtAuthService {
  constructor(private readonly jwtService: JwtService) {}

  createAccessToken(payload: AccessTokenPayload) {
    return this.jwtService.sign({ ...payload });
  }
}
