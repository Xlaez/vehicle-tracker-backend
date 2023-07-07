import { Module } from '@nestjs/common';
import { HistoryController } from './history.controller';
import { HistoryService } from './history.service';
import { History, HistorySchema } from './schema';
import { MongooseModule } from '@nestjs/mongoose';
import { EventsGateway } from 'src/core/events';
import { Vehicle, VehicleSchema, VehicleService } from '../vehicle';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: History.name, schema: HistorySchema },
      { name: Vehicle.name, schema: VehicleSchema },
    ]),
  ],
  controllers: [HistoryController],
  providers: [HistoryService, VehicleService],
})
export class HistoryModule {}
