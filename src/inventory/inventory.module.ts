import { forwardRef, Module } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryItem } from './entities/inventory-item.entity';
import { Inventory } from './entities/inventory.entity';
import { AuthModule } from 'src/auth/auth.module';
import { ProductsModule } from 'src/products/products.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  controllers: [InventoryController],
  providers: [InventoryService],
  imports: [
    TypeOrmModule.forFeature([
      InventoryItem,
      Inventory
    ]),
    forwardRef(() => AuthModule),
    ProductsModule,
    HttpModule,
  ],
  exports: [
    TypeOrmModule
  ]
})
export class InventoryModule {}
