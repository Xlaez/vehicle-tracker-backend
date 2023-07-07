import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { NewVehcileRouteDto } from './dto';
import { History, HistoryDocument } from './schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Vehicle, VehicleDocument, VehicleService } from '../vehicle';

@Injectable()
export class HistoryService {
  constructor(
    @Inject(forwardRef(() => VehicleService))
    private vehicleService: VehicleService,
    @InjectModel(History.name) protected HistorySchema: Model<HistoryDocument>,
    @InjectModel(Vehicle.name) protected VehicleSchema: Model<VehicleDocument>,
  ) {}

  addNewRouteHistory = async (dto: NewVehcileRouteDto, ownerId: string) => {
    await this.vehicleService.updateVehicleStatus(dto.vehicleId);
    return this.HistorySchema.create({ ...dto, ownerId });
  };

  getVehicleHistory = async (id: string) => {
    return this.HistorySchema.find({ vehicleId: id }).sort('asc');
  };

  getAllUserVehiclesCurrentPosition = async (id: string) => {
    const vehicles = await this.VehicleSchema.find({ ownerId: id }).exec();

    const vehicleIds = vehicles.map((vehicle) => vehicle._id);

    const histories = await this.HistorySchema.aggregate([
      {
        $sort: { createdAt: -1 }, // Sort by date in descending order
      },
      {
        $group: {
          _id: '$vehicleId',
          date: { $first: '$createdAt' }, // Take the first (most recent) date
          latittude: { $first: '$latitude' },
          longitude: { $first: '$longitude' },
          speed: { $first: '$speed' },
          altitude: { $first: '$altitude' },
          vehicleId: { $first: '$vehicleId' },
        },
      },
    ]).exec();

    const vehicleMap = new Map<string, Vehicle>();
    vehicles.forEach((vehicle) => {
      vehicleMap.set(vehicle._id.toString(), vehicle);
    });

    const toBeReturnedVehicles = [];

    histories.forEach((history) => {
      // console.log(history);
      const vehicleId = history._id.toString();
      if (vehicleMap.has(vehicleId)) {
        const vehicle = vehicleMap.get(vehicleId);
        vehicle.latitude = history.latitude;
        vehicle.longitude = history.longitude;
        vehicle.speed = history.speed;
        vehicle.altitude = history.altitude;
        toBeReturnedVehicles.push(vehicle);
      }
    });

    return toBeReturnedVehicles;
  };

  getHistoryById = async (id: string) => {
    return this.HistorySchema.findById(id);
  };
}
