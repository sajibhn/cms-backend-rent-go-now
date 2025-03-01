import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateApartmentDto } from './dto/create-apartment.dto';
import { UpdateApartmentDto } from './dto/update-apartment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Apartment } from './entities/apartment.entity';
import { Repository } from 'typeorm';
import { Point } from 'geojson';
import { Neighborhood } from 'src/neighborhood/entities/neighborhood.entity';

@Injectable()
export class ApartmentsService {

  constructor(
    @InjectRepository(Apartment)
    private readonly repo: Repository<Apartment>,

    @InjectRepository(Neighborhood)
    private readonly neighborhoodRepo: Repository<Neighborhood>,

  ) { }

  async create(body: CreateApartmentDto) {
    const pointObject: Point = {
      type: 'Point',
      coordinates: [body.location.coordinates[0], body.location.coordinates[1]],
    };

    const apartment = this.repo.create({
      ...body,
      location: pointObject,
      neighborhood: { id: body.neighborhoodId }
    });

    return await this.repo.save(apartment);
  }

  async findAll(name?: string) {

    const qb = this.repo.createQueryBuilder('apartment')
      .leftJoinAndSelect('apartment.neighborhood', 'neighborhood')

    if (name?.length) {
      qb.andWhere('apartment.name ILIKE :name', { name: `%${name}%` });
    }


    return await qb
      .orderBy('apartment.updated_at', 'DESC')
      .getMany();
  }

  async findOne(id: string) {
    return await this.repo.findOne({
      where: {
        id
      },
      relations: ['neighborhood']
    });
  }

  async update(id: string, body: UpdateApartmentDto) {
    const apartment = await this.repo.findOne({
      where: { id },
      relations: ['neighborhood']
    });

    if (!apartment) {
      throw new NotFoundException("Apartment not found");
    }

    if (body.location) {
      const pointObject: Point = {
        type: 'Point',
        coordinates: [body.location.coordinates[0], body.location.coordinates[1]],
      };

      apartment.location = pointObject;
    }

    if (body.neighborhoodId) {
      const neighborhood = await this.neighborhoodRepo.findOneBy({ id: body.neighborhoodId });
      if (!neighborhood) {
        throw new NotFoundException('Neighborhood not found');
      }

      apartment.neighborhood = neighborhood;
    }

    Object.assign(apartment, body)

    return await this.repo.save(apartment);
  }

  remove(id: number) {
    return `This action removes a #${id} apartment`;
  }
}
