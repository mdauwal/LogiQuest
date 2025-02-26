import { IsNotEmpty } from "class-validator";

export class PasswordResetDto {
    @IsNotEmpty()
    email: string;
  }
  