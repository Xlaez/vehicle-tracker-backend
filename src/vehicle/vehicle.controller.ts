import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { VehicleService } from './vehicle.service';
import { JwtAuthGuard } from 'src/guard';
import { NewVehicle } from './dto';

@Controller('vehicle')
export class VehicleController {
  constructor(private vehicleService: VehicleService) {}

  @Post('new')
  @UseGuards(JwtAuthGuard)
  async addVehicle(@Request() req, @Body() body: NewVehicle): Promise<any> {
    return this.vehicleService.addNewVehicle(body, req.user.sub);
  }

  @Get('user-vehicles')
  @UseGuards(JwtAuthGuard)
  async queryVehicles(
    @Request() req,
    @Query('keyword') keyword: string,
  ): Promise<any> {
    const vehicles = await this.vehicleService.queryVehicles(
      req.user.sub,
      keyword,
    );
    if (!vehicles.length)
      throw new NotFoundException('none of your vehicles match this keyword');
    return vehicles;
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getById(@Param('id') id: string): Promise<any> {
    const vehicle = await this.vehicleService.getVehicleById(id);
    if (!vehicle) throw new NotFoundException('vehicle not found');
    return vehicle;
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteVehicle(@Param('id') id: string): Promise<any> {
    return this.vehicleService.removeVehicle(id);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getUserVehicles(@Request() req): Promise<any> {
    const { count, vehicles } = await this.vehicleService.getUserVehicles(
      req.user.sub,
    );
    if (count === 0)
      throw new NotFoundException(
        "you don't have any vehicles in the database yet",
      );
    return { count, vehicles };
  }
}
