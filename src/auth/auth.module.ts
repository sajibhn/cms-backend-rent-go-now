import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/users/entities/user.entity';
import { ConfigService } from '@nestjs/config';

@Module({
	 imports: [TypeOrmModule.forFeature([Users])],
  controllers: [AuthController],
	providers: [AuthService, ConfigService],
})
export class AuthModule {}
