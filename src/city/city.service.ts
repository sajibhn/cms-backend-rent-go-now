import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { City } from './entities/city.entity';
import { Point } from 'geojson';
import { State } from 'src/state/entities/state.entity';

@Injectable()
export class CityService {
  constructor(
    @InjectRepository(City)
    private readonly repo: Repository<City>,

    @InjectRepository(State)
    private readonly stateRepo: Repository<State>,
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

    return await this.repo.save(city);

  }

  async findAll() {
    return await this.repo.find();
  }

  async findOne(id: string) {
    return await this.repo.findOneBy({ id });
  }


  async update(id: string, body: UpdateCityDto) {
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

    return await this.repo.save(city);
  }

  async remove(id: string) {
    await this.repo.delete(id);
  }
}
