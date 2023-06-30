import { HttpStatus, Injectable } from '@nestjs/common';
import { User, UserDocument } from './schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { hash } from 'argon2';
import { AppException } from 'src/exception';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private UserSchema: Model<UserDocument>,
  ) {}

  getUserById = async (id: string) => {
    return this.UserSchema.findById(id);
  };

  getUserByUsername = async (username: string) => {
    return this.UserSchema.findOne({ username });
  };

  getUserByEmail = async (email: string) => {
    return this.UserSchema.findOne({ email });
  };

  getUserOne = async (filter: any) => {
    return this.UserSchema.findOne(filter);
  };

  saveUser = async (body: any) => {
    if (body.password) body.password = await hash(body.password);
    return this.UserSchema.create(body);
  };

  deleteUser = async (id: string) => {
    return this.UserSchema.deleteOne({ _id: id });
  };

  updateUser = async (id: string, body: any) => {
    if (body.email) {
      if (this.getUserByEmail(body.email))
        throw new AppException({
          status: HttpStatus.BAD_REQUEST,
          error: 'email already taken',
        });
    }
    return this.UserSchema.findOneAndUpdate({ _id: id }, body, { new: true });
  };
}
