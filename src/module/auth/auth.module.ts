import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { JwtModuleAuth } from 'src/base/authorization/jwt.module';

@Module({
  imports: [UserModule, JwtModuleAuth],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
