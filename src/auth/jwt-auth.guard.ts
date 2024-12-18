import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Session } from 'src/sessions/entities/session.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtAuthGuard implements CanActivate {
	constructor(
		private readonly jwtService: JwtService,
		@InjectRepository(Session)
		private readonly sessionRepository: Repository<Session>,
		private configService: ConfigService,
	) { }

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest();
		const token = this.extractToken(request);

		if (!token) {
			throw new UnauthorizedException('No token provided');
		}

		
		try {
			
			const decodedToken = await this.jwtService.verify(token, {
				secret: this.configService.get<string>('JWt_SECRET_KEY')
			});
			
			const userId = decodedToken.id;

			if (!userId) {
				throw new UnauthorizedException('Invalid token');
			}

			const session = await this.sessionRepository.findOne({
				where: { session: token },
				relations: ['user'],
			});

			request.user = session.user;

			session.lastActivity = new Date();
			await this.sessionRepository.save(session);

			return true;
		} catch (err) {
			console.log(err)
			throw new UnauthorizedException('Invalid token');
		}
	}

	private extractToken(request: any): string | null {
		const authHeader = request.headers.authorization;
		if (authHeader && authHeader.startsWith('Bearer ')) {
			return authHeader.split(' ')[1];
		}
		return null;
	}
}
