import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { City } from './entities/city.entity';
import { Point } from 'geojson';
import { State } from 'src/state/entities/state.entity';
import { MediaService } from 'src/media/media.service';
import { ImageParentType } from 'src/media/entities/media.entity';

@Injectable()
export class CityService {
  constructor(
    @InjectRepository(City)
    private readonly repo: Repository<City>,

    @InjectRepository(State)
    private readonly stateRepo: Repository<State>,
    private readonly mediaService: MediaService,
  ) { }

  async create(body: CreateCityDto) {

    const pointObject: Point = {
      type: 'Point',
      coordinates: [body.location.coordinates[0], body.location.coordinates[1]],
    };

    const city = this.repo.create({
      ...body,
      location: pointObject,
      state: { id: body.stateId }
    });

    const savedCity = await this.repo.save(city);
    const media = await this.mediaService.saveImages(ImageParentType.CITY, savedCity.id, body.media)
    return {
      ...savedCity,
      mediaUrls: media.map(m => m.imageUrl)
    }
  }

  async findAll(name?: string) {

    const qb = this.repo.createQueryBuilder('city')

    if (name?.length) {
      qb.andWhere('city.name ILIKE :name', { name: `%${name}%` });
    }


    return await qb
      .leftJoinAndSelect('city.state', 'state')
      .orderBy('city.updated_at', 'DESC')
      .getMany();
  }

  async findOne(id: string) {
    const media = await this.mediaService.findByTypeAndId(ImageParentType.CITY, id)
    const city = await this.repo.findOne({
      where: {
        id
      },
      relations: ['state']
    });

    return {
      ...city,
      media: media.map(m => m.imageUrl)
    }
  }


  async update(id: string, { media, ...body }: UpdateCityDto) {
    const city = await this.repo.findOne({
      where: { id },
      relations: ['state']
    });

    if (!city) {
      throw new NotFoundException("City not found");
    }

    if (body.location) {
      const pointObject: Point = {
        type: 'Point',
        coordinates: [body.location.coordinates[0], body.location.coordinates[1]],
      };

      city.location = pointObject;
    }

    if (body.stateId) {
      const state = await this.stateRepo.findOneBy({ id: body.stateId });
      if (!state) {
        throw new NotFoundException('State not found');
      }

      city.state = state;
    }

    Object.assign(city, body)

    await this.repo.save(city);
    await this.mediaService.saveImages(ImageParentType.CITY, id, media)

    return this.repo.findOneBy({ id });
  }

  async remove(id: string) {
    await this.repo.delete(id);
  }
}
