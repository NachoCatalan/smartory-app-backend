import { IsString, MaxLength, MinLength } from "class-validator";

export class CreateProducerDto {

    @IsString()
    @MinLength(1)
    @MaxLength(25)
    name: string;
}