import { Controller, Post, Body, UseGuards, Res, Header, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto, RegisterUserDto } from './dto';
import { User } from './entities/user.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }
  @Post('register')
  register(@Body() registerUserDto: RegisterUserDto ) {
    return this.authService.register(registerUserDto);
  }
  @Post('refresh')
  verifyRefreshToken(@Body('refreshToken') token: string ){
    return this.authService.verifyToken(token);
  }
  @UseGuards(AuthGuard())
  @Get()
  getUsers() {
    return this.authService.getUsers();
  }
}
