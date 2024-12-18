import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/users/entities/user.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';
import { JwtModule } from '@nestjs/jwt';
import { Session } from 'src/sessions/entities/session.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Module({
	imports: [
		TypeOrmModule.forFeature([Users, Session]),
		JwtModule.registerAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => ({
				secret: configService.get<string>('JWt_SECRET_KEY'),
				signOptions: {
					expiresIn: configService.get<string>('JWT_EXPIRES_IN'),
				},
			}),
		}),
	],
 controllers: [AuthController],
	providers: [AuthService, ConfigService, UsersService, JwtAuthGuard],
	exports: [JwtAuthGuard]
})
export class AuthModule {}
