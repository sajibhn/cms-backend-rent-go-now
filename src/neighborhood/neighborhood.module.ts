import { Module } from '@nestjs/common';
import { NeighborhoodService } from './neighborhood.service';
import { NeighborhoodController } from './neighborhood.controller';
import { City } from 'src/city/entities/city.entity';
import { Neighborhood } from './entities/neighborhood.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Session } from 'src/sessions/entities/session.entity';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([Neighborhood, City, Session])],
  controllers: [NeighborhoodController],
  providers: [NeighborhoodService, Session, JwtService, ConfigService],
})
export class NeighborhoodModule { }
