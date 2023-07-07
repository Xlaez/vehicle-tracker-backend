import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class NewVehcileRouteDto {
  @IsString()
  @IsNotEmpty()
  vehicleId: string;

  @IsString()
  @IsNotEmpty()
  latitude: number;

  @IsString()
  @IsNotEmpty()
  longitude: number;

  @IsString()
  @IsOptional()
  speed: string;

  @IsString()
  @IsOptional()
  altitude: string;
}
