import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class LoginDTO {
  @IsString()
  @IsNotEmpty()
  email: string;
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class CreateUserDTO {
  @IsString()
  @IsNotEmpty()
  email: string;
  @IsString()
  @IsNotEmpty()
  password: string;
  @IsString()
  @IsNotEmpty()
  username: string;
  @IsString()
  @IsOptional()
  firstName: string;
  @IsString()
  @IsOptional()
  lastName: string;
}

export class VerifyOtpDto {
  @IsString()
  @IsNotEmpty()
  email: string;
  @IsString()
  @IsNotEmpty()
  otp: string;
  @IsString()
  @IsNotEmpty()
  sessionID: string;
}

export class ChangePasswordDTO {
  @IsString()
  @IsNotEmpty()
  currentPassword: string;
  @IsString()
  @IsNotEmpty()
  newPassword: string;
}

export class ForgotPasswordDTO {
  @IsString()
  @IsNotEmpty()
  email: string;
}

export class VerifyForgotPasswordDTO extends VerifyOtpDto {
  @IsString()
  @IsNotEmpty()
  newPassword: string;
}

export class ResetPasswordDTO extends ForgotPasswordDTO {}
