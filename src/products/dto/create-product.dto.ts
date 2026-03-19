import { IsArray, IsDate, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class CreateProductDto {

    @IsString()
    @MinLength(1)
    name: string;
    @IsString()
    @MinLength(1)
    @MaxLength(50)
    description: string;
    @IsDate()
    @IsOptional()
    fabDate?: Date;
    @IsDate()
    @IsOptional()
    expDate?: Date;
    @IsArray({
        each: true,
    })
    @IsString({
        each: true
    })
    @IsString({
        each:true
    })
    @IsOptional()
    @IsArray()
    images?: string[];
    @IsString()
    @IsOptional()
    @MinLength(1)
    @MaxLength(25)
    producer?: string;
    @IsString()
    @IsOptional()
    @MinLength(1)
    @MaxLength(50)
    category?: string;

}
