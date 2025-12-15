import { Body, Controller, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { UploadImageDto } from '../dtos/user-image.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter, UPLOAD_IMG_EXTNAME } from 'src/base/util/multer.helper';
import { MinioService } from 'src/base/minio/service/minio.service';
import { JwtGuard } from 'src/base/authorization/jwt.guard';

@ApiTags('Image/ User')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('image')
export class UserImageController {
  constructor(private readonly minioService: MinioService) {}

  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UploadImageDto })
  @Post('upload-img')
  @UseInterceptors(FileInterceptor('file', { fileFilter: fileFilter(UPLOAD_IMG_EXTNAME) }))
  async uploadImg(@UploadedFile() file: Express.Multer.File, @Body('folder') folder: string) {
    if (!file) {
      throw new Error('No file uploaded');
    }

    return await this.minioService.uploadByMulter(file, [folder, 'photoPath']);
  }
}
