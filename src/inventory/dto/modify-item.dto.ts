import { PartialType } from "@nestjs/mapped-types";
import { CreateItemDto } from "./create-item.dto";
import { IsNumber } from "class-validator";
import { Type } from "class-transformer";

export class ModifyItemDto extends PartialType(CreateItemDto) {
    @IsNumber()
    @Type( () => Number)
    itemId: number;
}