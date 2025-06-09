import { IsEmail, IsNotEmpty, IsString, Min, MinLength } from "class-validator";

export class UserResponseDto {
    Id:string;
    firstName: string;
    lastName: string;
    fullName: string;
    username: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;   

}