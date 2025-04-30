import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MediaService } from './media.service';
import { ImageParentType } from './entities/media.entity';
import { uploadToCloudinary } from 'src/utils/cloudinary';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) { }

  @Post('upload-to-cloudinary')
  @UseInterceptors(FileInterceptor('file'))
  async uploadToCloudinaryOnly(@UploadedFile() file: Express.Multer.File) {
    const result = await uploadToCloudinary(file);
    return {
      imageUrl: result.secure_url,
    };
  }

  @Post('save-url')
  async saveUrlToDb(
    @Body('type') type: ImageParentType,
    @Body('typeId') typeId: string,
    @Body('imageUrl') imageUrl: string[],
  ) {
    return this.mediaService.saveImages(type, typeId, imageUrl);
  }
}
