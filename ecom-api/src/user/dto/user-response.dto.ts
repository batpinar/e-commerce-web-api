import { IsEmail, IsNotEmpty, IsString, Min, MinLength } from "class-validator";
import { UserRole } from "../../types/user-role.enum";

export class UserResponseDto {
    Id:string;
    firstName: string;
    lastName: string;
    fullName: string;
    username: string;
    email: string;
    role: UserRole;
    createdAt: Date;
    updatedAt: Date;   

}