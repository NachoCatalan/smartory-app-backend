import { BadRequestException } from '@nestjs/common';
import { CreateItemDto } from '../dto/create-item.dto';
import { InventoryInstructionDto } from '../dto/inventory-instruction.dto';
import { AmountUnit } from '../enums';

export class InventoryInstructionMapper {
  static toCreateItemDto(instruction: InventoryInstructionDto): CreateItemDto {
    if (!instruction.product.id) {
      throw new BadRequestException(
        `La instrucción no tiene un producto asociado`,
      );
    }

    return {
      productId: instruction.product.id,
      quantity: instruction.quantity,
      amountUnit: instruction.unit as AmountUnit,
    };
  }
}