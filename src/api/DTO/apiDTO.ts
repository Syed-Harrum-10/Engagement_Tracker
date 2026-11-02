import { IsEmail, IsInt, Min } from 'class-validator';

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
  @IsEmail()
  email: string;
}
