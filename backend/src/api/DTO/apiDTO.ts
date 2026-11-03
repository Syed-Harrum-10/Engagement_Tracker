import { IsEmail, IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateEventDto {
  @IsInt()
  userId: number;

  @IsInt()
  imageId: number;

  @IsInt()
  @Min(0)
  dwellSeconds: number;
}

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsEmail()
  email: string;
}

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
