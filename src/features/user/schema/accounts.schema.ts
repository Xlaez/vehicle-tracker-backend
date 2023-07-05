import { HydratedDocument } from 'mongoose';
import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { isEmail } from 'class-validator';
import { toJSON } from './plugins';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ type: String, required: true, minlength: 2 })
  username: string;

  @Prop({
    type: String,
    required: true,
    unique: true,
    index: true,
    validator: [
      { validator: isEmail, message: () => 'provide a valid email address' },
    ],
  })
  email: string;

  @Prop({
    type: String,
    required: false,
    minlength: 5,
    private: true,
  })
  password: string;

  @Prop({ type: String, default: 'https://cloudinary.com/owablog/' })
  img: string;

  @Prop({ type: Boolean, default: false, private: true })
  isEmailVerified: boolean;

  @Prop({
    type: String,
    enum: ['google', 'facebook', 'login'],
    default: 'login',
  })
  loginType: string;

  @Prop({ type: String })
  loginToken: string;
}

const UserSchema = SchemaFactory.createForClass(User);
UserSchema.plugin(toJSON);

export { UserSchema };
