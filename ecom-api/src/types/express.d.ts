import { User } from "@prisma/client";

declare module "express" {
    export interface Request {
        user:Partial<User>; // Optional user property
    }
}