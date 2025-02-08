import { BadRequestException, HttpException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { OtpDto } from './dto/opt.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { SignInDto } from './dto/signin.dto';
import { JwtService } from '@nestjs/jwt';
import { Session } from 'src/sessions/entities/session.entity';
const otpGenerator = require('otp-generator');
const nodemailer = require("nodemailer");

@Injectable()
export class AuthService {

		constructor(
			@InjectRepository(Users)
			private usersRepo: Repository<Users>,

			@InjectRepository(Session)
			private sessionsRepo: Repository<Session>,

			private configService: ConfigService,
			private readonly jwtService: JwtService,
		) {}

	async signin({ email, otp }: SignInDto) {

		const user = await this.usersRepo.findOne({ 
			where: { email, otp }
		});
		if (!user) {
			throw new UnauthorizedException('Invalid credentials');
		}

		user.otp = null;
		await this.usersRepo.save(user);

		const payload = { email: user.email, id: user.id };
		const token = this.jwtService.sign(payload);

		const session = this.sessionsRepo.create({
			session: token,
			user,
			lastActivity: new Date(),
		});

		await this.sessionsRepo.save(session);

		const roles = ['SUPERADMIN'];

		return {
			id: user.id,
			firstName: user.firstName,
			lastName: user.lastName,
			email: user.email,
			roles,
			token, 
			session,
		};
	}

	async sendOtp(body: OtpDto) {

		const user = await this.usersRepo.findOne({
			where: {
				email: body.email
			}
		})

		if(!user) {
			throw new NotFoundException('user not found');
		}

		if (user.isBanned) {
			throw new HttpException('You are not authorized to access system anymore, please contact administrator.', 403);
		}

		const otpToSend = await otpGenerator.generate(6, {
			upperCaseAlphabets: false,
			lowerCaseAlphabets: false,
			specialChars: false,
			digits: true,
		});

		user.otp = otpToSend;

		await this.usersRepo.save(user);

		const messageToSend = `Hello ${user.firstName}, your signin OTP is ${otpToSend}.`;

		try {
			const transporter = nodemailer.createTransport({
				host: "smtp.gmail.com",
				port: 465,
				secure: true,
				auth: {
					user: this.configService.get<string>('ADMIN_EMAIL'),
					pass: this.configService.get<string>('ADMIN_EMAIL_PASSWORD'),
				},
			});

   await transporter.sendMail({
				from: `"Admin from RentGoNow" <${this.configService.get<string>('ADMIN_EMAIL') }>`,
				to: user.email,
				subject: messageToSend,
				text: messageToSend,
			});

		} catch (error) {
			throw new BadRequestException("Error sending email");
		}

		return { messageToSend }
	}

	signout() {

	}
}
