import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';
import { User } from '../../user';
import { toJSON } from '../../user/schema/plugins';

export type VehicleDocument = HydratedDocument<Vehicle>;

@Schema({ timestamps: true })
export class Vehicle {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: User.name, required: true })
  ownerId: string;

  @Prop({ type: String, required: true })
  type: string;

  @Prop({
    type: String,
    enum: ['online', 'offline', 'idle', 'moving'],
    default: 'offline',
  })
  status: string;
  @Prop({ type: String, required: false })
  longitude: string;
  @Prop({ type: String, required: false })
  speed: string;
  @Prop({ type: String, required: false })
  latitude: string;
  @Prop({ type: String, required: false })
  altitude: string;
}

const VehicleSchema = SchemaFactory.createForClass(Vehicle);
VehicleSchema.plugin(toJSON);

export { VehicleSchema };
