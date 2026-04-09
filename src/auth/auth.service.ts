import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { LoginUserDto, RegisterUserDto } from './dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}
  
  async login(loginUserDto: LoginUserDto) {
    const {email, password} = loginUserDto;
    const user = await this.userRepository.findOneBy({email});
    if ( !user || !(await bcrypt.compare(password, user.password)) )
      throw new BadRequestException('Username/Password is not valid');
    const refreshToken = this.getRefreshToken({id: user.id});
    user.refreshToken = await bcrypt.hash(refreshToken, 10);
    const dbUser = await this.userRepository.save(user);
    return {
      token: this.getToken({id: dbUser.id}),
      refreshToken
    }
  }
  async register(registerUserDto: RegisterUserDto) {
    try {
      const { password, ...rest } = registerUserDto;
      const user = this.userRepository.create({
        ...rest,
        password: await bcrypt.hash(password, 10),
      });
      const dbUser = await this.userRepository.save(user);
      return {
        accessToken: this.getToken({id: dbUser.id}),
      }
    } catch (error) {
      if ( error.code === '23505') 
        throw new BadRequestException(error.detail);
      throw new InternalServerErrorException({error});
    }
  }
  
  async verifyToken(token: string) {
    try {
      const { id } = this.jwtService.verify<JwtPayload>(token);
      const user = await this.userRepository.findOneBy({id});
      if (!user) throw new UnauthorizedException('Invalid Token');
      if ( !(await bcrypt.compare(token, user.refreshToken)) ) throw new BadRequestException('Token is not longer valid'); 
      const refreshToken =  this.getRefreshToken({id});
      user.refreshToken = await bcrypt.hash(refreshToken, 10);
      await this.userRepository.save(user);
      return {
        accessToken: this.getToken({id}),
        refreshToken
      }
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  
  async getUsers() {
    const users = await this.userRepository.find();
    if ( users.length === 0 ) throw new NotFoundException('Not users found in DB');
    return users.map( user => {
      const { password, refreshToken, ...rest } = user;
      return { ...rest }
    });
  }
  

  getToken( payload: JwtPayload ) {
    return this.jwtService.sign(payload);
  }
  getRefreshToken( payload: JwtPayload) {
    const { id } = payload;
    return this.jwtService.sign({id}, {expiresIn: '7d'});
  }
}
