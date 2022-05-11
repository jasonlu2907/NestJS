import { Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth') // localhost:3333/auth
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup') // .../signup
  signup() {
    return this.authService.signup();
  }

  @Post('signin') // .../signin
  signin() {
    return this.authService.signin();
  }
}
