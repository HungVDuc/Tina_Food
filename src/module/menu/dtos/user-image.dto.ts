import { ApiProperty } from '@nestjs/swagger';

export class UploadImageDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
  })
  file: any;

  @ApiProperty({
    example: 'menu',
    description: 'Upload folder (menu, dish, avatar...)',
  })
  folder: string;
}
