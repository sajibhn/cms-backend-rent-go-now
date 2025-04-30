import { Module } from '@nestjs/common';
import { UnitsService } from './units.service';
import { UnitsController } from './units.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Apartment } from 'src/apartments/entities/apartment.entity';
import { Unit } from './entities/unit.entity';
import { MediaModule } from 'src/media/media.module';

@Module({
  imports: [TypeOrmModule.forFeature([Unit, Apartment]),
    MediaModule
  ],
  controllers: [UnitsController],
  providers: [UnitsService],
})
export class UnitsModule {}
