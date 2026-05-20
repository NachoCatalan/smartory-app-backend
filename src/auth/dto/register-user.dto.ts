import { IsEmail, IsString, IsStrongPassword, MaxLength, MinLength } from "class-validator";

export class RegisterUserDto {
    @IsString()
    @IsEmail()
    @MaxLength(30)
    email: string;
    @IsString()
    @IsStrongPassword({
        minLength: 7,
        minNumbers: 1,
        minUppercase: 1,
        minSymbols: 1
    })
    password: string;
}