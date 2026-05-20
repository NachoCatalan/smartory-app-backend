import { IsDate, IsEnum, IsInt, IsNumber,  IsOptional, IsPositive, IsString, IsUUID } from "class-validator";
import { AmountUnit } from "../enums";
import { Type } from "class-transformer";


export class CreateItemDto {

    @IsUUID()
    productId: string;
    @IsInt( )
    @IsPositive()
    quantity: number;
    @IsOptional()
    @Type( () => Number)
    @IsNumber()
    @IsPositive()
    totalAmount?: number;
    @IsOptional()
    @Type( () => Number)
    @IsNumber()
    @IsPositive()
    remainingAmount?: number;
    @IsOptional()
    @IsEnum(AmountUnit)
    amountUnit?: AmountUnit
    @IsOptional()
    @Type( () => Date)
    @IsDate()
    expirationDate?: Date;
}