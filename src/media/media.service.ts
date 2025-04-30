import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Media, ImageParentType } from './entities/media.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(Media)
    private readonly mediaRepository: Repository<Media>,
  ) { }

  async saveImages(
    type: ImageParentType,
    typeId: string,
    imageUrls: string[]
  ): Promise<Media[]> {
    await this.mediaRepository.delete({
      type,
      typeId
    });

    const newMediaRecords = imageUrls.map(url =>
      this.mediaRepository.create({
        type,
        typeId,
        imageUrl: url
      })
    );

    return this.mediaRepository.save(newMediaRecords);
  }

  async findByTypeAndId(type: ImageParentType, typeId: string): Promise<Media[]> {
    return this.mediaRepository.find({
      where: { type, typeId },
    });
  }
}
