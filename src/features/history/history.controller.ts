import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { HistoryService } from './history.service';
import { NewVehcileRouteDto } from './dto';
import { IPayload, JwtAuthGuard } from '../../shared';

@Controller('history')
export class HistoryController {
  constructor(private historyService: HistoryService) {}

  @Post('new')
  @UseGuards(JwtAuthGuard)
  async addVehicleRouteHistory(
    @Body() body: NewVehcileRouteDto,
    @Request() req,
  ): Promise<any> {
    return this.historyService.addNewRouteHistory(body, req.user.sub);
  }

  @Get('vehicles/current-position')
  @UseGuards(JwtAuthGuard)
  async getAllUserVehiclesCurrentPosition(@Request() req): Promise<any> {
    return this.historyService.getAllUserVehiclesCurrentPosition(req.user.sub);
  }

  @Get('vehicle/:vehicleId')
  @UseGuards(JwtAuthGuard)
  async getHistoryForvehicle(@Param('vehicleId') id: string): Promise<any> {
    const history = await this.historyService.getVehicleHistory(id);
    if (!history.length)
      throw new NotFoundException('route history for this vehicle not found');
    return history;
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getHistory(@Param('id') id: string): Promise<any> {
    const history = await this.historyService.getHistoryById(id);
    if (!history) throw new NotFoundException('route history not found');
    return history;
  }
}
