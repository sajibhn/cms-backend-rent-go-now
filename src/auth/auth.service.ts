import { BadRequestException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { OtpDto } from './dto/opt.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
const otpGenerator = require('otp-generator');
const nodemailer = require("nodemailer");

@Injectable()
export class AuthService {

		constructor(
			@InjectRepository(Users)
			private usersRepo: Repository<Users>,

			private configService: ConfigService
		) {}

	signin() {
		
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
