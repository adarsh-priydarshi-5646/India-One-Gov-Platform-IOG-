import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  phoneNumber: string;
  email?: string;
  aadhaarHash: string;
  fullName: string;
  passwordHash: string;
  role: 'CITIZEN' | 'OFFICER' | 'POLITICIAN' | 'ADMIN' | 'SUPER_ADMIN';
  isVerified: boolean;
  isActive: boolean;
  state?: string;
  district?: string;
  profilePhotoUrl?: string;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    aadhaarHash: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['CITIZEN', 'OFFICER', 'POLITICIAN', 'ADMIN', 'SUPER_ADMIN'],
      default: 'CITIZEN',
      index: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    state: {
      type: String,
      trim: true,
    },
    district: {
      type: String,
      trim: true,
    },
    profilePhotoUrl: {
      type: String,
    },
    lastLoginAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    collection: 'users',
  }
);

// Indexes for performance
UserSchema.index({ phoneNumber: 1, isActive: 1 });
UserSchema.index({ email: 1, isActive: 1 });
UserSchema.index({ state: 1, district: 1 });
UserSchema.index({ role: 1, isActive: 1 });

// Methods
UserSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.passwordHash;
  delete obj.__v;
  return obj;
};

export const User = mongoose.model<IUser>('User', UserSchema);
