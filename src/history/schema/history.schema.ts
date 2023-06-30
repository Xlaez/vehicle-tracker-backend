import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';
import { toJSON } from 'src/user/schema';
import { Vehicle } from 'src/vehicle/schema';

export type HistoryDocument = HydratedDocument<History>;

@Schema({ timestamps: true })
export class History {
  @Prop({ type: SchemaTypes.ObjectId, ref: Vehicle.name, required: true })
  vehicleId: string;

  @Prop({ type: String, required: true })
  latitude: string;

  @Prop({ type: String, required: true })
  longitude: string;

  @Prop({ type: String, required: false })
  speed: string;

  @Prop({ type: String, required: false })
  altitude: string;
}

const HistorySchema = SchemaFactory.createForClass(History);

HistorySchema.plugin(toJSON);

export { HistorySchema };
