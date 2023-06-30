import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class NewVehcileRouteDto {
  @IsString()
  @IsNotEmpty()
  vehicleId: string;

  @IsString()
  @IsNotEmpty()
  latitude: string;

  @IsString()
  @IsNotEmpty()
  longitude: string;

  @IsString()
  @IsNotEmpty()
  speed: string;

  @IsString()
  @IsOptional()
  altitude: string;
}
