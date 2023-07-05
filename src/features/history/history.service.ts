import { Injectable } from '@nestjs/common';
import { NewVehcileRouteDto } from './dto';
import { History, HistoryDocument } from './schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class HistoryService {
  constructor(
    @InjectModel(History.name) protected HistorySchema: Model<HistoryDocument>,
  ) {}

  addNewRouteHistory = async (dto: NewVehcileRouteDto) => {
    return this.HistorySchema.create({ ...dto });
  };

  getVehicleHistory = async (id: string) => {
    return this.HistorySchema.find({ vehicleId: id }).sort('asc');
  };

  getHistoryById = async (id: string) => {
    return this.HistorySchema.findById(id);
  };
}
