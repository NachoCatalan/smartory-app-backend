import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { LoginUserDto, RegisterUserDto } from './dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { DataSource } from 'typeorm';
import { Inventory } from 'src/inventory/entities/inventory.entity';

@Injectable()
export class AuthService {
  
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private dataSource: DataSource,
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
    const { password, ...rest } = registerUserDto;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const user = queryRunner.manager.create(User, {
        ...rest,
        password: await bcrypt.hash(password, 10),
      });
      const dbUser = await queryRunner.manager.save(user);
      // Creacion del inventario
      const newInventory = queryRunner.manager.create(Inventory, {user: dbUser});
      await queryRunner.manager.save(newInventory);
      await queryRunner.commitTransaction();
      return {
        accessToken: this.getToken({id: dbUser.id}),
      }
    } catch (e: any) {
      await queryRunner.rollbackTransaction();
      if ( e.code === '23505') 
        throw new BadRequestException(e.detail);
      throw new InternalServerErrorException({e});
    } finally {
      await queryRunner.release();
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
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }
  
  async getUsers() {
    const users = await this.userRepository.find();
    if ( users.length === 0 ) throw new NotFoundException('Not users found in DB');
    return users.map( user => {
      const { refreshToken, ...rest } = user;
      return { ...rest }
    });
  }
  async getUserById(id: string) {
    const user = await this.userRepository.findOne({where: {id}});
    if ( !user ) throw new BadRequestException(`Usuario con id ${id} no encontrado`);
    return user;
  }
  

  getToken( payload: JwtPayload ) {
    return this.jwtService.sign(payload);
  }
  getRefreshToken( payload: JwtPayload) {
    const { id } = payload;
    return this.jwtService.sign({id}, {expiresIn: '7d'});
  }
}
