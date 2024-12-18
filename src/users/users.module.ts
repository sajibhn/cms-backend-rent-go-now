import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { Session } from 'src/sessions/entities/session.entity';
import { ConfigService } from '@nestjs/config';

@Module({
	imports: [TypeOrmModule.forFeature([Users, Session])],
  controllers: [UsersController],
  providers: [UsersService, JwtService, ConfigService],
})
export class UsersModule {}
