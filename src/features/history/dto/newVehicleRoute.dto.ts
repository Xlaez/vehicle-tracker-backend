import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class NewVehcileRouteDto {
  @IsString()
  @IsNotEmpty()
  vehicleId: string;

  @IsNumber()
  @IsNotEmpty()
  latitude: number;

  @IsNumber()
  @IsNotEmpty()
  longitude: number;

  @IsString()
  @IsOptional()
  speed: string;

  @IsString()
  @IsOptional()
  altitude: string;
}
