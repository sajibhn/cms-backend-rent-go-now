import { Module } from '@nestjs/common';
import { ApartmentsService } from './apartments.service';
import { ApartmentsController } from './apartments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Apartment } from './entities/apartment.entity';
import { Neighborhood } from 'src/neighborhood/entities/neighborhood.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Apartment, Neighborhood])],
  controllers: [ApartmentsController],
  providers: [ApartmentsService],
})
export class ApartmentsModule {}
