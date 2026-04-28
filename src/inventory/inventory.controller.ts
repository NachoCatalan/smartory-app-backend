import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { CreateItemDto } from './dto/create-item.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/decorators/user.decorator';

@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get(':id')
  @UseGuards(AuthGuard())
  getItemFromUser(@GetUser('id') userId: string, @Param('id', ParseIntPipe) id: number) {
    return this.inventoryService.getItemFromUser(userId, id);
  }
  @Get()
  getItemsFromInventory(@GetUser('id') userId: string) {
    return this.inventoryService.getUserInventory(userId);
  }

  @Post()
  @UseGuards(AuthGuard())
  createItem(@GetUser('id') userId: string,@Body() createItemDto: CreateItemDto) {
    return this.inventoryService.addItem(userId, createItemDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard())
  deleteItem(@GetUser('id') userId: string, @Param('id', ParseIntPipe) id: number) {
    return this.inventoryService.deleteItem(userId, id);
  }

}

