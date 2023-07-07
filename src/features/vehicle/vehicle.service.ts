import { Injectable } from '@nestjs/common';
import { Vehicle, VehicleDocument } from './schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { NewVehicle } from './dto';

@Injectable()
export class VehicleService {
  constructor(
    @InjectModel(Vehicle.name) protected VehicleSchema: Model<VehicleDocument>,
  ) {}

  addNewVehicle = async (dto: NewVehicle, userId: string) => {
    return this.VehicleSchema.create({ ...dto, ownerId: userId });
  };

  updateVehicleStatus = async (id: string) => {
    return this.VehicleSchema.updateOne(
      { _id: id },
      { $set: { status: 'online' } },
    );
  };

  getVehicleById = async (id: string) => {
    return this.VehicleSchema.findById(id);
  };

  removeVehicle = async (id: string) => {
    return this.VehicleSchema.deleteOne({ _id: id });
  };

  getUserVehicles = async (userId: string) => {
    const userVehicles = await this.VehicleSchema.find({
      ownerId: userId,
    }).sort('asc');
    const vehiclesCount = await this.VehicleSchema.find({
      ownerId: userId,
    }).countDocuments();
    return { vehicles: userVehicles, count: vehiclesCount };
  };

  queryVehicles = async (userId: string, keyword: string) => {
    const filter = {
      $and: [{ ownerId: userId }, { name: { $regex: keyword, $options: 'i' } }],
    };

    return this.VehicleSchema.find(filter).sort('name');
  };
}
