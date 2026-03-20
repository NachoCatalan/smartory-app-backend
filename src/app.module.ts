import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { envConfig, envSchema } from './config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from './products/products.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [ envConfig ],
      validationSchema: envSchema
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT!,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      autoLoadEntities: true,
      synchronize: true
    }),
    ProductsModule,
    CommonModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
