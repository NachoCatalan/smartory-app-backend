import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InventoryItem } from './entities/inventory-item.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateItemDto } from './dto/create-item.dto';
import { ProductsService } from 'src/products/products.service';
import { Inventory } from './entities/inventory.entity';
import { AmountUnit, ProductStatus } from './enums';
import { AuthService } from 'src/auth/auth.service';
import { ModifyItemDto } from './dto/modify-item.dto';
import { Product } from 'src/products/entities';
import { AudioInstruction } from './interfaces/audio_instruction.interface';
import multer from 'multer';
import { HttpService } from '@nestjs/axios';
import { InventoryInstructionDto } from './dto/inventory-instruction.dto';
import { InventoryInstructionMapper } from './mappers/inventory_instruction_mapper';
import { UnitConverter } from 'src/common/helpers/unit-converter.helper';

@Injectable()
export class InventoryService {
    
    constructor(
        @InjectRepository(InventoryItem)
        private readonly itemRepository: Repository<InventoryItem>,
        @InjectRepository(Inventory)
        private readonly inventoryRepository: Repository<Inventory>,
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
        private readonly userService: AuthService,
        private readonly productService: ProductsService,
        private readonly httpService: HttpService,
    ) {}

    async sendAudioToConvert(file: Express.Multer.File): Promise<AudioInstruction[]> {
        const formData = new FormData();

        const blob = new Blob([new Uint8Array(file.buffer)], { type: file.mimetype });
        formData.append('file', blob, file.originalname);
        const response = await this.httpService.axiosRef.post('http://127.0.0.1:8000/audio',formData);
        return response.data;
    }

    async processAudioToInstruction(userId: string, file: Express.Multer.File) {
        const data = await this.sendAudioToConvert(file);

        // Respuesta simulada, borrar después

        const instructions: AudioInstruction[] = [
            {
                "action": "add",
                "productToFind": "leche",
                "quantity": 2,
                "unit": "lt",
            },
            {
                "action": "update",
                "productToFind": "arroz",
                "quantity": 0.5,
                "unit": "kg",
            },
            {
                "action": "remove",
                "productToFind": "manzana",
                "quantity": 3,
                "unit": "unidad",
            }
        ];
        const results: any = [];

        for (const instruction of instructions) {
                if (instruction.action === 'add') {
                const result = await this.processToAddInstruction(instruction);
                results.push(result);
            }

            if (instruction.action === 'update') {
                const result = await this.processToUpdateInstruction(userId, instruction);
                results.push(result);
            }

            if (instruction.action === 'remove') {
                const result = await this.processToRemoveInstruction(userId, instruction);
                results.push(result);
            }
        }
        return results;
    }

    private async processToAddInstruction(instruction: AudioInstruction) {

        const productFromCatalogue = await this.productService.matchByName(instruction.productToFind);

        if ( productFromCatalogue.length === 0 ) {
            return {
                action: 'add',
                productToFind: instruction.productToFind,
                product: null,
                unit: instruction.unit,
                quantity:instruction.quantity,
                status: 'Producto no encontrado',
                message: `No se encontró el producto ${instruction.productToFind} en el catálogo`,
            };
        }

        if (productFromCatalogue.length === 1) {
            return {
                action: 'add',
                status: 'pending',
                productToFind: instruction.productToFind,
                product: productFromCatalogue[0],
                unit: instruction.unit,
                quantity:instruction.quantity,
                message: 'Producto encontrado'
            };
        }
    
        return {
            action: 'add',
            status: 'pending',
            productToFind: instruction.productToFind,
            product: productFromCatalogue,
            unit: instruction.unit,
            quantity:instruction.quantity,
            message: 'Coinicidencias encontradas'
        };
    }

    private async processToUpdateInstruction(userId: string, instruction: AudioInstruction) {
        const items = await this.findInventoryItemByProductName(userId, instruction.productToFind);

        if ( items.length === 0) {
            return {
                action: 'update',
                productToFind: instruction.productToFind,
                product: null,
                status: 'Item no encontrado',
                unit: instruction.unit,
                quantity:instruction.quantity,
                message: `No existe ${instruction.productToFind} en el inventario`,
            };
        }
        if ( items.length === 1 ) {
            return {
                action: 'update',
                productToFind: instruction.productToFind,
                product: items[0].product,
                status: 'item encontrado',
                quantity: instruction.quantity,
                unit: instruction.unit,
                message: ""
            };
        }
        return {
            action: 'update',
            productToFind: instruction.productToFind,
            product: items.map((item) => item.product),
            status: 'Coincidencias encontradas',
            quantity: instruction.quantity,
            unit: instruction.unit,
            message: ""
        };
        
    }

    private async processToRemoveInstruction(userId: string,instruction: AudioInstruction) {
        const items = await this.findInventoryItemByProductName(userId,instruction.productToFind);

        if ( items.length === 0 ) {
            return {
                action: 'remove',
                productToFind: instruction.productToFind,
                product: null,
                status: 'item no encontrado',
                message: `${instruction.productToFind} no estaba en el inventario`,
                unit: instruction.unit,
                quantity:instruction.quantity,
            };
        }
        if ( items.length === 1 ) {
            return {
                action: 'remove',
                productToFind: instruction.productToFind,
                product: items[0].product,
                status: 'Item a eliminar',
                unit: instruction.unit,
                quantity:instruction.quantity,
                message: ""
            };
        }
        
        return {
            action: 'remove',
            productToFind: instruction.productToFind,
            product: items.map((item) => item.product),
            status: 'Coincidencias encontradas',
            unit: instruction.unit,
            quantity:instruction.quantity,
            message: ""
        };
    }
    async processInstructions(userId: string, inventoryInstructionsDto: InventoryInstructionDto[]) {

        const itemsToProcess = inventoryInstructionsDto.filter(( instruction) => instruction.product != null);

        const itemsToAdd = itemsToProcess.filter((instruction) => instruction.action === 'add');
        const itemsToUpdate = itemsToProcess.filter((instruction) => instruction.action === 'update');
        const itemsToRemove = itemsToProcess.filter((instruction) => instruction.action === 'remove');
        for (const item of itemsToAdd) {
            if ( item.action === 'add') {
                const itemToSave = InventoryInstructionMapper.toCreateItemDto(item);
                await this.addItem(userId,itemToSave);
            }
            continue;
            
        }
        for (const item of itemsToUpdate) {
            if ( item.action === 'update') {
                const { unit } = item;
                await this.decrementItem(userId, item, unit as AmountUnit );
            }
            continue;
        }
        for (const item of itemsToRemove) {
            if (item.product != null && item.action === 'remove'){
                const itemToDelete = await this.findInventoryItemByProductName(userId, item.product.name);
                await this.deleteItem(userId, itemToDelete[0].id);
            }
        }

        const response = {
            'message': 'Inventario actualizado correctamente',
            'added': itemsToAdd.length,
            'updated': itemsToUpdate.length,
            'removed': itemsToRemove.length
        }
        return response;
    }

    private async findInventoryItemByProductName(userId: string, productName: string): Promise<InventoryItem[]> {
        const inventoryItems = await this.itemRepository.find({
            where: {
            inventory: {
                user: {
                    id: userId,
                },
            },
            },
            relations: {
                product: true,
            },
        });
        const normalizedProductName = productName.toLowerCase().trim();
        return inventoryItems.filter((item) =>
            item.product.name.toLowerCase().includes(normalizedProductName),
        );
    }

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

    //* OPERACIONES CRUD *
    async addItem(userId: string, item: CreateItemDto) {
        const { productId, ...rest } = item;
        const user = await this.userService.getUserById(userId);
        const product = await this.productRepository.findOneBy({id: productId});
        const { id: inventoryId } = user.inventory;
        try {
            const inventory = await this.getInventory(inventoryId);
            const existingItem = await this.itemRepository.findOne({
                where: {
                    product: { id: productId},
                    inventory: { id: inventoryId },
                },
            });
            const { quantity } = rest; 
            if ( existingItem != null ) {
                await this.itemRepository.increment({id: existingItem.id}, "quantity", item.quantity);
                await this.itemRepository.increment({id: existingItem.id}, "totalAmount", product?.amount! * quantity);
                await this.itemRepository.increment({id: existingItem.id}, "remainingAmount", product?.amount! * quantity);
            } else {
                const newItem = this.itemRepository.create({
                    inventory: inventory,
                    product: product as Product,
                    status: ProductStatus.AVAILABLE,
                    amountUnit: product?.amountUnit,
                    // TODO: corregir estos campos para no sean opcionales o que vengan con un valor por defecto
                    totalAmount: product?.amount! * quantity,
                    remainingAmount: product?.amount! * quantity,
                    expirationDate: item.expirationDate,
                    quantity: item.quantity,
                    isFavorite: false,
                });
                await this.itemRepository.save(newItem);
            }   
            return { message: 'Item ingresado correctamente'};
        } catch (error) {
            throw new InternalServerErrorException('Error al crear el item');
        }
    }

    async modifyItem(userId: string, modifyItemDto: ModifyItemDto) {
        if ( Object.keys(modifyItemDto).length === 0 || Object.keys(modifyItemDto) === null ) throw new BadRequestException('Ninguna entrada provista');
        const { itemId, ...rest} = modifyItemDto;
        const user = await this.userService.getUserById(userId);
        const { id: inventoryId } = user.inventory;
        const currentItem = await this.itemRepository.findOneBy({id: itemId, inventory: { id: inventoryId}});
        if ( !currentItem ) throw new BadRequestException({ message: 'Item no existe en el inventario'});
        try {
            const updatedProduct = { ...currentItem, ...rest};
            const updatedItem = await this.itemRepository.save(updatedProduct);
            return { item: updatedItem }
        } catch (error) {
            throw new BadRequestException({error});
        }
    }

    async decrementItem(userId: string, item: InventoryInstructionDto, unit: AmountUnit) {
        let standarizedQuantity: number;
        switch (unit) {
            case AmountUnit.KG:
                standarizedQuantity = UnitConverter.kilogramsToGrams(item.quantity);
                break;
            case AmountUnit.LT:
                standarizedQuantity = UnitConverter.litersToMilliliters(item.quantity);
                break;
            default:
                standarizedQuantity = item.quantity;
                break;
        }

        const user = await this.userService.getUserById(userId);
        const product = await this.productRepository.findOneBy({id: item.product.id});
        console.log({product});


        const { id: inventoryId } = user.inventory;

        try {
            const existingItem = await this.itemRepository.findOne({
                where: {
                    product: { id: product!.id },
                    inventory: { id: inventoryId },
                },
            });

            if (!existingItem) {
                throw new NotFoundException('El item no existe en el inventario');
            }

            // Falta estandarizar las unidades que se usan dependiendo del producto
            // Puede que el inventoryItem este en Kilos y la cantidad a descontar o sumar este en gramos
            // Mismo caso para los liquidos
            const amountToDecrement = unit === AmountUnit.UN
                ? product!.amount! * standarizedQuantity
                : standarizedQuantity!;
            let itemRemainingAmount: number;
            let newRemainingAmount: number;
            switch (existingItem.amountUnit) {
                case AmountUnit.KG:
                    itemRemainingAmount = UnitConverter.kilogramsToGrams(existingItem.remainingAmount);
                    newRemainingAmount = UnitConverter.gramsToKilograms(itemRemainingAmount - amountToDecrement);
                    break;
                case AmountUnit.LT:
                    itemRemainingAmount = UnitConverter.litersToMilliliters(existingItem.remainingAmount);
                    newRemainingAmount = UnitConverter.millilitersToLiters(itemRemainingAmount - amountToDecrement);
                    break;
                default:
                    newRemainingAmount = existingItem.remainingAmount - amountToDecrement;
                    return;
            }

            const newQuantity = Math.ceil(newRemainingAmount / product!.amount!);

            if (newQuantity <= 0 || newRemainingAmount <= 0) {
                await this.itemRepository.delete(existingItem.id);

            return {message: 'Item eliminado del inventario'};
            }

            await this.itemRepository.update(existingItem.id, {
                quantity: newQuantity,
                totalAmount: newQuantity * product?.amount!,
                remainingAmount: newRemainingAmount,
            });

            return {message: 'Item descontado correctamente'};
            } catch (error) {
                if (error instanceof NotFoundException) {
                    throw error;
                }
                throw new InternalServerErrorException('Error al descontar el item');
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

    async getItemsFromNameMatch(userId: string, itemName: string) {

        const items = await this.itemRepository
            .createQueryBuilder('item')
            .leftJoinAndSelect('item.product', 'product')
            .leftJoinAndSelect('product.producer', 'producer')
            .leftJoinAndSelect('product.category', 'category')
            .leftJoinAndSelect('product.images', 'images')
            .leftJoin('item.inventory', 'inventory')
            .leftJoin('inventory.user', 'user')
            .where('user.id = :userId AND LOWER(product.name) LIKE :itemName', {
                itemName: `%${itemName.toLowerCase()}%`,
                userId: userId
            })
            .getMany();
        console.log({items});
        return items;
    }

    async getInventory(id: number) {
        const inventory = await this.inventoryRepository.findOneBy({id});
        if ( !inventory ) throw new NotFoundException(`Inventario con id ${id} no existe`);
        return inventory;
    }

}
