import { IsNotEmpty, IsString } from 'class-validator';

export class NewVehicle {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
  type: string;
}
