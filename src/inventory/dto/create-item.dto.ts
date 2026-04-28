import { IsDate, IsNumber, IsNumberString, IsOptional, IsPositive, IsString, IsUUID, MaxLength, MinLength } from "class-validator";
import { ProductStatus } from "../enums";


export class CreateItemDto {

    @IsString()
    @IsUUID()
    productId: string;
    @IsNumber()
    @IsPositive()
    quantity: number;
    @IsDate()
    @IsOptional()
    expirationDate?: Date;
    
}