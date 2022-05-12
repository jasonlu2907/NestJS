import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDTO } from './dto';

@Controller('auth') // localhost:3333/auth
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup') // .../signup
  signup(@Body() dto: AuthDTO) {
    console.log({
      dto: dto,
    });
    return this.authService.signup(dto);
  }

  @Post('signin') // .../signin
  signin(@Body() dto: AuthDTO) {
    return this.authService.signin(dto);
  }
}
