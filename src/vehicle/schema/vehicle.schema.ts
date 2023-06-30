import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';
import { User, toJSON } from 'src/user/schema';

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
}

const VehicleSchema = SchemaFactory.createForClass(Vehicle);
VehicleSchema.plugin(toJSON);

export { VehicleSchema };
