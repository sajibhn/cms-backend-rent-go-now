import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateNeighborhoodDto } from './dto/create-neighborhood.dto';
import { UpdateNeighborhoodDto } from './dto/update-neighborhood.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Neighborhood } from './entities/neighborhood.entity';
import { Repository } from 'typeorm';
import { City } from 'src/city/entities/city.entity';
import { Point } from 'geojson';

@Injectable()
export class NeighborhoodService {

  constructor(
    @InjectRepository(Neighborhood)
    private readonly repo: Repository<Neighborhood>,

    @InjectRepository(City)
    private readonly cityRepo: Repository<City>
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

    return await this.repo.save(neighborhood);
  }

  async findAll() {
    const qb = this.repo.createQueryBuilder('neighborhood')
      .leftJoinAndSelect('neighborhood.city', 'city')

    return await qb
      .orderBy('neighborhood.updated_at', 'DESC')
      .getMany();
  }

  async findOne(id: string) {
    return await this.repo.findOne({
      where: {
        id
      },
      relations: ['city']
    });
  }

  async update(id: string, body: UpdateNeighborhoodDto) {
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

    return await this.repo.save(neighborhood);
  }

  async remove(id: string) {
    await this.repo.delete(id);
  }
}
