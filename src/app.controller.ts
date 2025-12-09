import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private config: ConfigService,
  ) {}

  @Get()
  getHello(): string {
    console.log(this.config.get<string>('MONGO_URI'));

    return this.appService.getHello();
  }
}
