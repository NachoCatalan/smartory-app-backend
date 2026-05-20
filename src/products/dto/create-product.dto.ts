import { Type } from "class-transformer";
import { IsArray, IsEnum, IsNumber, IsOptional, IsString, MaxLength, MinLength } from "class-validator";
import { AmountUnit } from "src/inventory/enums";

export class CreateProductDto {

    @IsString()
    @MinLength(1)
    @MaxLength(100)
    name: string;
    @IsOptional()
    @IsString()
    @MinLength(1)
    @MaxLength(50)
    description?: string;
    @IsOptional()
    @IsArray()
    @IsString({
        each:true
    })
    images?: string[];
    @IsOptional()
    @IsString()
    @MinLength(1)
    @MaxLength(25)
    producer?: string;
    @IsString()
    @IsOptional()
    @MinLength(1)
    @MaxLength(50)
    category?: string;
    @IsOptional()
    @IsEnum(AmountUnit)
    amountUnit?: AmountUnit;
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    amount?: number;
    @IsOptional()
    @IsString()
    barcode?: string;
}
