import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client as MinioClient } from 'minio';
import path from 'path';
import { uniqueFileName } from 'src/base/util/multer.helper';

export class BaseMinioService {
  protected readonly client: MinioClient;
  protected readonly bucket: string;

  constructor(
    protected readonly accessKey: string,
    protected readonly secretKey: string,
    protected readonly bucketName: string,
    protected readonly endPoint: string,
    protected readonly port: number,
    protected readonly useSSL: boolean,
  ) {
    this.bucket = bucketName;
    this.client = this.createClient();
    this.ensureBucket();
  }

  private createClient(): MinioClient {
    return new MinioClient({
      endPoint: this.endPoint,
      port: this.port,
      useSSL: this.useSSL,
      accessKey: this.accessKey,
      secretKey: this.secretKey,
    });
  }

  private async ensureBucket() {
    try {
      const exists = await this.client.bucketExists(this.bucket);
      if (!exists) {
        await this.client.makeBucket(this.bucket);
        console.log(`Created bucket: ${this.bucket}`);

        const policy = {
          Version: '2012-10-17',
          Statement: [
            {
              Effect: 'Allow',
              Principal: { AWS: ['*'] },
              Action: ['s3:GetObject'],
              Resource: [`arn:aws:s3:::${this.bucket}/*`],
            },
          ],
        };

        await this.client.setBucketPolicy(this.bucket, JSON.stringify(policy));
        console.log(`Bucket ${this.bucket} is now public`);
      }
    } catch (error) {
      console.error(`Bucket check failed: ${error.message}`);
    }
  }

  /** Upload file (Multer) */
  async uploadFile(file: Express.Multer.File): Promise<string> {
    const fileName = `${Date.now()}-${file.originalname}`;
    await this.client.putObject(this.bucket, fileName, file.buffer, file.size, {
      'Content-Type': file.mimetype,
    });

    return this.getFileUrl(fileName);
  }

  async uploadByMulter(file: Express.Multer.File, folder?: (string | number)[], bucket?: string) {
    const { originalname } = file;
    const fileName = uniqueFileName(originalname);
    const filePath = folder
      ? path.posix.join(...folder.map((o) => o.toString()), fileName)
      : fileName;
    const uploadResult = await this.uploadBuffer(
      file.buffer,
      fileName,
      file.mimetype,
      bucket ?? this.bucket,
      filePath,
    );

    return {
      filePath,
      uploadResult,
      uploadedFile: {
        ...file,
        destination: filePath,
        path: this.getFileUrl(filePath),
        buffer: undefined,
      },
    };
  }

  async uploadBuffer(
    buffer: Buffer,
    fileName: string,
    mimetype: string,
    bucket: string,
    key: string,
  ): Promise<{
    bucket: string;
    key: string;
    url: string;
  }> {
    try {
      const usedBucket = bucket ?? this.bucket;
      const usedKey = key ?? fileName;

      await this.client.putObject(usedBucket, usedKey, buffer, buffer.length, {
        'Content-Type': mimetype,
      });

      return {
        bucket: usedBucket,
        key: usedKey,
        url: this.getFileUrl(usedKey),
      };
    } catch (err) {
      console.error('Upload failed:', err);
      throw err;
    }
  }

  /** Lấy stream file */
  async getFile(fileName: string) {
    return this.client.getObject(this.bucket, fileName);
  }

  getFileUrl(key: string): string {
    const protocol = this.useSSL ? 'https' : 'http';
    return `${protocol}://${this.endPoint}:${this.port}/${this.bucket}/${key}`;
  }

  /** Tạo URL có chữ ký tạm thời (private) */
  async getSignedUrl(fileName: string, expiry = 3600): Promise<string> {
    return this.client.presignedGetObject(this.bucket, fileName, expiry);
  }

  /** Xoá file */
  async deleteFile(fileName: string) {
    await this.client.removeObject(this.bucket, fileName);
    return { message: `Deleted: ${fileName}` };
  }
}

@Injectable()
export class MinioService extends BaseMinioService {
  constructor(protected readonly config: ConfigService) {
    super(
      config.get<string>('MINIO_ACCESS_KEY'),
      config.get<string>('MINIO_SECRET_KEY'),
      config.get<string>('MINIO_BUCKET'),
      config.get<string>('MINIO_ENDPOINT'),
      Number(config.get<string>('MINIO_PORT')),
      config.get<string>('MINIO_USE_SSL') === 'true',
    );
  }
}
