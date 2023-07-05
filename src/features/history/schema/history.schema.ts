import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';
import { toJSON } from '../../user/schema/plugins';
import { Vehicle } from '../../vehicle';

export type HistoryDocument = HydratedDocument<History>;

@Schema({ timestamps: true })
export class History {
  @Prop({ type: SchemaTypes.ObjectId, ref: Vehicle.name, required: true })
  vehicleId: string;

  @Prop({ type: Number, required: true })
  latitude: number;

  @Prop({ type: Number, required: true })
  longitude: number;

  @Prop({ type: String, required: false })
  speed: string;

  @Prop({ type: String, required: false })
  altitude: string;
}

const HistorySchema = SchemaFactory.createForClass(History);

HistorySchema.plugin(toJSON);

export { HistorySchema };
