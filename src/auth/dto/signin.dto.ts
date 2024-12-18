import { IsEmail, IsNotEmpty, IsNumber } from 'class-validator';

export class SignInDto {
	@IsEmail()
	@IsNotEmpty()
	email: string;

	@IsNumber()
	@IsNotEmpty()
	otp: string;
}