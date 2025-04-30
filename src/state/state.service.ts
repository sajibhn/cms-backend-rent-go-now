import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateStateDto } from './dto/create-state.dto';
import { UpdateStateDto } from './dto/update-state.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { State } from './entities/state.entity';
import { ILike, Repository } from 'typeorm';
import { Point } from 'geojson';
import { ImageParentType, Media } from 'src/media/entities/media.entity';
import { MediaService } from 'src/media/media.service';

@Injectable()
export class StateService {
  constructor(
    @InjectRepository(State)
    private readonly repo: Repository<State>,
    private readonly mediaService: MediaService,

  ) { }

  async create(body: CreateStateDto) {

    const pointObject: Point = {
      type: 'Point',
      coordinates: [body.location.coordinates[0], body.location.coordinates[1]],
    };

    const state = this.repo.create({
      ...body,
      location: pointObject,
    });

    const savedState = await this.repo.save(state);
    const media = await this.mediaService.saveImages(ImageParentType.STATE, savedState.id, body.media  )
    return {
      ...savedState,
      mediaUrls: media.map(m => m.imageUrl)
    }
  }

  async findAll(name?: string) {
    const qb = this.repo.createQueryBuilder('state');

    if (name?.length) {
      qb.andWhere('state.name ILIKE :name', { name: `%${name}%` });
    }

    return await qb
      .orderBy('state.updated_at', 'DESC')
      .getMany();
  }

  async findOne(id: string) {

    const state = await this.repo.findOneBy({ id });
    const media = await this.mediaService.findByTypeAndId(ImageParentType.STATE, id)

    return {
      ...state,
      media: media.map(m => m.imageUrl)
    }
  }

  async update(id: string, {media, ...body}: UpdateStateDto) {

    const state = await this.repo.findOneBy({ id });

    if (!state) {
      throw new NotFoundException("State not found");
    }

    if (body.location) {
      const pointObject: Point = {
        type: 'Point',
        coordinates: [body.location.coordinates[0], body.location.coordinates[1]],
      };

      body.location = pointObject;
    }

    await this.repo.update(id, body);
    await this.mediaService.saveImages(ImageParentType.STATE, id, media)

    return this.repo.findOneBy({ id });
  }

  async remove(id: string) {
    await this.repo.delete(id);
  }

  async findByName(name: string) {
    return await this.repo.find({
      where: { name: ILike(`%${name}%`) },
    });
  }
}
