import { Type } from "class-transformer";
import { IsInstance, IsNumber, IsOptional, IsPositive, IsString, IsUUID } from "class-validator";
import { Product } from "src/products/entities";


export class InventoryInstructionDto {

    @IsString()
    action: string;
    @IsString()
    productToFind: string;
    @IsOptional()
    @IsInstance(Product)
    product: Product; // TODO: acá retornar solo el id del producto
    @IsString() // TODO: utilizar un decorador para inferir el tipo de unidad según el enum
    unit: string;
    @Type( () => Number)
    @IsNumber()
    @IsPositive()
    quantity: number;
    @IsString()
    @IsOptional()
    status: string;
    @IsString()
    @IsOptional()
    message: string;
    
}