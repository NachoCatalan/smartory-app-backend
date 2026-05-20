import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { CreateItemDto } from './dto/create-item.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/decorators/user.decorator';
import { ModifyItemDto } from './dto/modify-item.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Express } from 'express';
import { Multer } from 'multer';
import { InventoryInstructionDto } from './dto/inventory-instruction.dto';

@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get(':id')
  @UseGuards(AuthGuard())
  getItemFromUser(@GetUser('id') userId: string, @Param('id', ParseIntPipe) id: number) {
    return this.inventoryService.getItemFromUser(userId, id);
  }
  @Get()
  @UseGuards(AuthGuard())
  getItemsFromInventory(@GetUser('id') userId: string) {
    return this.inventoryService.getUserInventory(userId);
  }

  @Post()
  @UseGuards(AuthGuard())
  createItem(@GetUser('id') userId: string,@Body() createItemDto: CreateItemDto) {
    console.log(createItemDto);
    return this.inventoryService.addItem(userId, createItemDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard())
  deleteItem(@GetUser('id') userId: string, @Param('id', ParseIntPipe) id: number) {
    return this.inventoryService.deleteItem(userId, id);
  }
  
  @Put()
  @UseGuards(AuthGuard())
  modifyItem(@GetUser('id') userId: string, @Body() modifyItemDto: ModifyItemDto) {
    return this.inventoryService.modifyItem(userId, modifyItemDto);
  }

  @Post('process-audio')
  @UseGuards(AuthGuard())
  @UseInterceptors(FileInterceptor('file'))
  processAudio(@GetUser('id') userId: string, @UploadedFile() file: Express.Multer.File) {
    return this.inventoryService.processAudioToInstruction(userId, file);
  }
  @Post('process-instructions')
  @UseGuards(AuthGuard())
  processInstructions(@GetUser('id') userId: string, @Body() inventoryInstructionsDto: InventoryInstructionDto[]) {
    return this.inventoryService.processInstructions(userId, inventoryInstructionsDto);
  }

  @Get('match/:name')
  @UseGuards(AuthGuard())
  searchItemsByName(@GetUser('id') userId: string, @Param('name') name: string ) {
    return this.inventoryService.getItemsFromNameMatch(userId, name);
  }
}

