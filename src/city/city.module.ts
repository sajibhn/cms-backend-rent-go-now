import { Module } from '@nestjs/common';
import { CityService } from './city.service';
import { CityController } from './city.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { City } from './entities/city.entity';
import { State } from 'src/state/entities/state.entity';
import { MediaModule } from 'src/media/media.module';

@Module({
  imports: [TypeOrmModule.forFeature([City, State]),
    MediaModule
  ],
  controllers: [CityController],
  providers: [CityService],
})
export class CityModule { }
