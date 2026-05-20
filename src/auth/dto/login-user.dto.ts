import { IsEmail, IsString, IsStrongPassword, MaxLength } from "class-validator";


export class LoginUserDto {

    @IsString()
    @IsEmail()
    @MaxLength(30)
    email: string;
    @IsString()
    password: string;

}