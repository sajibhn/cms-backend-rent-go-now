import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUnitDto } from './dto/create-unit.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Unit } from './entities/unit.entity';
import { Repository } from 'typeorm';
import { Apartment } from 'src/apartments/entities/apartment.entity';
import { ImageParentType } from 'src/media/entities/media.entity';
import { MediaService } from 'src/media/media.service';

@Injectable()
export class UnitsService {
  constructor(
    @InjectRepository(Unit)
    private readonly repo: Repository<Unit>,
    @InjectRepository(Apartment)
    private readonly apartmentRepo: Repository<Apartment>,
    private readonly mediaService: MediaService,
  ) { }

  async create(body: CreateUnitDto) {

    const apartment = await this.apartmentRepo.findOneBy({
      id: body.apartmentId
    });
    if (!apartment) {
      throw new NotFoundException('Apartment not found');
    }

    const unit = this.repo.create({
      ...body,
      apartment: { id: body.apartmentId },
    });

    const savedUnit = await this.repo.save(unit);
    const media = await this.mediaService.saveImages(ImageParentType.UNIT, savedUnit.id, body.media)
    return {
      ...savedUnit,
      mediaUrls: media.map(m => m.imageUrl)
    }
  }

  async findAll(name?: string, apartmentId?: string) {
    const qb = this.repo.createQueryBuilder('unit')
      .leftJoinAndSelect('unit.apartment', 'apartment');

    if (name?.length) {
      qb.andWhere('unit.name ILIKE :name', { name: `%${name}%` });
    }

    if (apartmentId) {
      qb.andWhere('unit.apartmentId = :apartmentId', { apartmentId });
    }

    return await qb
      .orderBy('unit.updated_at', 'DESC')
      .getMany();
  }

  async findOne(id: string) {
    const unit = await this.repo.findOne({
      where: { id },
      relations: ['apartment'],
    });

    if (!unit) {
      throw new NotFoundException('Unit not found');
    }

    const media = await this.mediaService.findByTypeAndId(ImageParentType.UNIT, id)

    return {
      ...unit,
      media: media.map(m => m.imageUrl)
    }
  }

  async update(id: string, { media, ...body }: UpdateUnitDto) {
    const unit = await this.repo.findOne({
      where: { id },
      relations: ['apartment'],
    });

    if (!unit) {
      throw new NotFoundException('Unit not found');
    }

    if (body.apartmentId) {
      const apartment = await this.apartmentRepo.findOneBy({
        id: body.apartmentId
      });
      if (!apartment) {
        throw new NotFoundException('Apartment not found');
      }
      unit.apartment = apartment;
    }

    Object.assign(unit, body);
    await this.repo.save(unit);

    await this.mediaService.saveImages(ImageParentType.UNIT, id, media)
    return this.repo.findOneBy({ id });
  }

  async remove(id: string) {
    const unit = await this.repo.findOneBy({ id });
    if (!unit) {
      throw new NotFoundException('Unit not found');
    }

    await this.repo.remove(unit);
    return { message: 'Unit deleted successfully' };
  }
}