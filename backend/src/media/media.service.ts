import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';

@Injectable()
export class MediaService {
  private s3Client: S3Client;
  private bucketName: string;

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    const region = this.configService.get('AWS_REGION');
    const accessKeyId = this.configService.get('AWS_ACCESS_KEY_ID');
    const secretAccessKey = this.configService.get('AWS_SECRET_ACCESS_KEY');

    if (region && accessKeyId && secretAccessKey) {
      this.s3Client = new S3Client({
        region,
        credentials: {
          accessKeyId,
          secretAccessKey,
        },
      });
      this.bucketName = this.configService.get('S3_BUCKET_NAME') || 'legal-pets-media';
    }
  }

  async uploadFile(
    file: Express.Multer.File,
    petId?: string,
    altText?: string,
  ) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    // For MVP, you can store files locally or use S3
    // This is a simplified version - in production, add image processing, thumbnails, etc.
    const fileExtension = file.originalname.split('.').pop();
    const fileName = `${randomUUID()}.${fileExtension}`;
    const fileUrl = await this.uploadToS3(file.buffer, fileName, file.mimetype);

    const media = await this.prisma.media.create({
      data: {
        url: fileUrl,
        type: this.getMediaType(file.mimetype),
        altText,
        petId,
        mimeType: file.mimetype,
        size: file.size,
      },
    });

    return media;
  }

  private async uploadToS3(buffer: Buffer, fileName: string, mimeType: string): Promise<string> {
    if (!this.s3Client) {
      // Fallback: return a placeholder URL or use local storage
      // In production, implement proper file storage
      return `/uploads/${fileName}`;
    }

    try {
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: fileName,
        Body: buffer,
        ContentType: mimeType,
        ACL: 'public-read',
      });

      await this.s3Client.send(command);
      return `https://${this.bucketName}.s3.amazonaws.com/${fileName}`;
    } catch (error) {
      console.error('S3 upload error:', error);
      throw new BadRequestException('Failed to upload file');
    }
  }

  private getMediaType(mimeType: string): 'IMAGE' | 'VIDEO' | 'DOCUMENT' {
    if (mimeType.startsWith('image/')) return 'IMAGE';
    if (mimeType.startsWith('video/')) return 'VIDEO';
    return 'DOCUMENT';
  }

  async deleteMedia(id: string) {
    const media = await this.prisma.media.findUnique({
      where: { id },
    });

    if (!media) {
      throw new BadRequestException('Media not found');
    }

    // TODO: Delete from S3 as well
    await this.prisma.media.delete({
      where: { id },
    });

    return { message: 'Media deleted successfully' };
  }
}

