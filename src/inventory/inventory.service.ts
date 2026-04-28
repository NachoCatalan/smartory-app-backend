import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InventoryItem } from './entities/inventory-item.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateItemDto } from './dto/create-item.dto';
import { ProductsService } from 'src/products/products.service';
import { Inventory } from './entities/inventory.entity';
import { ProductStatus } from './enums';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class InventoryService {

    constructor(
        @InjectRepository(InventoryItem)
        private readonly itemRepository: Repository<InventoryItem>,
        @InjectRepository(Inventory)
        private readonly inventoryRepository: Repository<Inventory>,
        private readonly userService: AuthService,
        private readonly productService: ProductsService,
    ) {}

    async getUserInventory(userId: string) {
        try {
            const inventoryItems = await this.itemRepository.find({
                where: {
                    inventory: {
                        user: {
                            id: userId
                        }
                    }
                }
            });
            const user = await this.userService.getUserById(userId);
            return {
                id: user.inventory.id,
                items: inventoryItems
            };
        } catch (error) {
            throw new BadRequestException(`Error: ${error}`);
        }
    }

    async addItem(id: string, item: CreateItemDto) {
        const { productId, ...rest } = item;
        const user = await this.userService.getUserById(id);
        const product = await this.productService.findOne(productId);
        const { id: inventoryId } = user.inventory;
        try {
            const inventory = await this.getInventory(inventoryId);
            // TODO 1: revisar si el producto ya existe, y si existe sumar las cantidades
            // TODO 2: implementar otra forma de duplicidad que contemple los otros parametros que puedan ser diferentes
            const newItem = this.itemRepository.create({
                inventory: inventory,
                product: product,
                status: ProductStatus.AVAILABLE,
                ...rest
            });
            await this.itemRepository.save(newItem);
            return { message: 'Item creado correctamente'};
        } catch (error) {
            throw new InternalServerErrorException('Error al crear el item');
        }
    }

    async deleteItem(userId: string, id: number) {
        const itemToDelete = await this.getItemFromUser(userId, id);
        try {
            await this.itemRepository.delete({id: itemToDelete.id});
            return { message: 'Item removido con éxito'};
        } catch (error) {
            throw new InternalServerErrorException(`${error}`);
        }
    }
    async getItemFromUser(userId: string, id: number) {
        const item = await this.itemRepository.findOne({
            where: {
                id,
                inventory: {
                    user: {
                        id: userId
                    }
                }
            }
        });
        if ( !item ) throw new NotFoundException(`Item con id ${id} no existe`);
        return item;
    }

    async getInventory(id: number) {
        const inventory = await this.inventoryRepository.findOneBy({id});
        if ( !inventory ) throw new NotFoundException(`Inventario con id ${id} no existe`);
        return inventory;
    }

}
