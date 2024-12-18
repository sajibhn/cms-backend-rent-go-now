import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { OtpDto } from './dto/opt.dto';
import { SignInDto } from './dto/signin.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

	@Post('/signin')
	signin(
		@Body() body: SignInDto,
	) {
		return this.authService.signin(body);
	}

  @Post('/otp')
		sendOtp(@Body() body: OtpDto) {
			return this.authService.sendOtp(body);
  }

  @Post('/signout')
		signout(@Body() body: any) {
			return this.authService.signout();
  }
}
