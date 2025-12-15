import * as path from 'path';
import { slugify } from './string.convert';
import { randomAlphabet } from './random.util';
import { BadRequestException } from '@nestjs/common';

export const UPLOAD_IMG_EXTNAME = /(jpg|jpeg|png|gif|bmp|tif|tiff|ico|svg|svg\+xml)$/isu;

export const uniqueFileName = (originalname: string) => {
  const { name, ext } = path.parse(originalname);
  return [new Date().getTime(), randomAlphabet(8), slugify(name)].join('-') + ext;
};

export const fileFilter =
  (mimetypes: RegExp = UPLOAD_IMG_EXTNAME) =>
  (req: Request, file: Express.Multer.File, callback) => {
    if (!file.mimetype.match(mimetypes)) {
      return callback(new BadRequestException('File format is incorrect'), false);
    }
    callback(null, true);
  };
