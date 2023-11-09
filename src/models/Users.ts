import { Schema } from 'mongoose';
import db from '../db/index';
import bcrypt from 'bcryptjs';

export interface IDrawing {
  steps: number[];
  currentIndex: number;
  img: string;
}

export interface IUser {
  _id: any;
  // email: string;
  password: string;
  drawnings?: IDrawing[];
}

export const UsersSchema = new Schema<IUser>(
  {
    // email: {
    //   type: String,
    //   required: true,
    //   lowercase: true,
    //   unique: true
    // },
    password: {
      type: String,
      required: [true, 'Please, provide the password.'],
      minlength: [6, 'The password must be at least 6 characters long.'],
      select: false
    },
    drawnings: [
      {
        steps: Number,
        currentIndex: Number,
        img: String
      }
    ]
  },
  {
    versionKey: false,
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
  }
);

UsersSchema.pre('save', async function (next) {
  const user = this;

  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 12);
  }

  next();
});

const User = db.model('Users', UsersSchema, 'Users');

export default User;

// export default db.StringArtDB?.model<IUser>('Users', UsersSchema, 'Users');
