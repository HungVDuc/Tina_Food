import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { JwtAuthService } from './jwt.service';
import { JwtStrategy } from './jwt.strategy';
import { UserModule } from 'src/module/user/user.module';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) =>
        ({
          secret: config.get<string>('ACCESS_SECRET'),
          signOptions: { expiresIn: config.get<string>('ACCESS_TOKEN_EXP') || '1h' },
        }) as JwtModuleOptions,
    }),
    UserModule,
  ],
  providers: [JwtAuthService, JwtStrategy],
  exports: [JwtAuthService],
})
export class JwtModuleAuth {}
