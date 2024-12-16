import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { OtpDto } from './dto/opt.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

	@Post('/signin')
	signin(
		@Body() body: any,
	) {
		return this.authService.signin();
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
