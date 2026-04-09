import { IsArray, IsDate, IsOptional, IsString, Max, MaxLength, MinLength } from "class-validator";

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

}
