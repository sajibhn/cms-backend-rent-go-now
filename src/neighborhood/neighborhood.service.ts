import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateNeighborhoodDto } from './dto/create-neighborhood.dto';
import { UpdateNeighborhoodDto } from './dto/update-neighborhood.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Neighborhood } from './entities/neighborhood.entity';
import { Repository } from 'typeorm';
import { City } from 'src/city/entities/city.entity';
import { Point } from 'geojson';
import { ImageParentType } from 'src/media/entities/media.entity';
import { MediaService } from 'src/media/media.service';

@Injectable()
export class NeighborhoodService {

  constructor(
    @InjectRepository(Neighborhood)
    private readonly repo: Repository<Neighborhood>,

    @InjectRepository(City)
    private readonly cityRepo: Repository<City>,
    private readonly mediaService: MediaService,
  ) { }

  async create(body: CreateNeighborhoodDto) {
    const pointObject: Point = {
      type: 'Point',
      coordinates: [body.location.coordinates[0], body.location.coordinates[1]],
    };

    const neighborhood = this.repo.create({
      ...body,
      location: pointObject,
      city: { id: body.cityId }
    });

    const savedNeighborhood = await this.repo.save(neighborhood);

    const media = await this.mediaService.saveImages(ImageParentType.NEIGHBORHOOD, savedNeighborhood.id, body.media  )
        return {
          ...savedNeighborhood,
          mediaUrls: media.map(m => m.imageUrl)
        }
  }

  async findAll(name?: string) {
    const qb = this.repo.createQueryBuilder('neighborhood')
      .leftJoinAndSelect('neighborhood.city', 'city')

    if (name?.length) {
      qb.andWhere('neighborhood.name ILIKE :name', { name: `%${name}%` });
    }

    return await qb
      .orderBy('neighborhood.updated_at', 'DESC')
      .getMany();
  }

  async findOne(id: string) {
    const neighborhood = await this.repo.findOne({
      where: {
        id
      },
      relations: ['city']
    });

    const media = await this.mediaService.findByTypeAndId(ImageParentType.NEIGHBORHOOD, id)

    return {
      ...neighborhood,
      media: media.map(m => m.imageUrl)
    }
  }

  async update(id: string, { media, ...body }: UpdateNeighborhoodDto) {
    const neighborhood = await this.repo.findOne({
      where: { id },
      relations: ['city']
    });

    if (!neighborhood) {
      throw new NotFoundException("Neighborhood not found");
    }

    if (body.location) {
      const pointObject: Point = {
        type: 'Point',
        coordinates: [body.location.coordinates[0], body.location.coordinates[1]],
      };

      neighborhood.location = pointObject;
    }

    if (body.cityId) {
      const city = await this.cityRepo.findOneBy({ id: body.cityId });
      if (!city) {
        throw new NotFoundException('City not found');
      }

      neighborhood.city = city;
    }

    Object.assign(neighborhood, body)

    await this.repo.save(neighborhood);
    await this.mediaService.saveImages(ImageParentType.NEIGHBORHOOD, id, media)
    return this.repo.findOneBy({ id });
  }

  async remove(id: string) {
    await this.repo.delete(id);
  }
}
