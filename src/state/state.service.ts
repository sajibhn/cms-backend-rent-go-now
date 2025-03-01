import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateStateDto } from './dto/create-state.dto';
import { UpdateStateDto } from './dto/update-state.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { State } from './entities/state.entity';
import { ILike, Repository } from 'typeorm';
import { Point } from 'geojson';

@Injectable()
export class StateService {
  constructor(
    @InjectRepository(State)
    private readonly repo: Repository<State>,
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

    return await this.repo.save(state);
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
    return await this.repo.findOneBy({ id });
  }

  async update(id: string, body: UpdateStateDto) {

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
