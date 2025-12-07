import { User, IUser } from '../models/User.model';
import { logger } from '../utils/logger';

export interface CreateUserDTO {
  phoneNumber: string;
  email?: string;
  aadhaarHash: string;
  fullName: string;
  passwordHash: string;
  role?: 'CITIZEN' | 'OFFICER' | 'POLITICIAN' | 'ADMIN' | 'SUPER_ADMIN';
  state?: string;
  district?: string;
}

export interface UpdateUserDTO {
  fullName?: string;
  email?: string;
  state?: string;
  district?: string;
  profilePhotoUrl?: string;
  isVerified?: boolean;
  isActive?: boolean;
}

export class UserRepository {
  async create(data: CreateUserDTO): Promise<IUser> {
    try {
      const user = new User(data);
      await user.save();
      logger.info(`User created: ${user._id}`);
      return user;
    } catch (error: any) {
      if (error.code === 11000) {
        const field = Object.keys(error.keyPattern)[0];
        throw new Error(`${field} already exists`);
      }
      throw error;
    }
  }

  async findById(id: string): Promise<IUser | null> {
    return await User.findById(id);
  }

  async findByPhoneNumber(phoneNumber: string): Promise<IUser | null> {
    return await User.findOne({ phoneNumber });
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return await User.findOne({ email });
  }

  async findByAadhaarHash(aadhaarHash: string): Promise<IUser | null> {
    return await User.findOne({ aadhaarHash });
  }

  async findByIdentifier(identifier: string): Promise<IUser | null> {
    // Identifier can be phone number or email
    return await User.findOne({
      $or: [{ phoneNumber: identifier }, { email: identifier }],
    });
  }

  async markAsVerified(id: string): Promise<IUser | null> {
    return await User.findByIdAndUpdate(
      id,
      { $set: { isVerified: true } },
      { new: true }
    );
  }

  async update(id: string, data: UpdateUserDTO): Promise<IUser | null> {
    return await User.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    );
  }

  async updateLastLogin(id: string): Promise<void> {
    await User.findByIdAndUpdate(id, {
      $set: { lastLoginAt: new Date() },
    });
  }

  async deactivate(id: string): Promise<IUser | null> {
    return await User.findByIdAndUpdate(
      id,
      { $set: { isActive: false } },
      { new: true }
    );
  }

  async verifyUser(id: string): Promise<IUser | null> {
    return await User.findByIdAndUpdate(
      id,
      { $set: { isVerified: true } },
      { new: true }
    );
  }

  async findAll(filters: {
    role?: string;
    state?: string;
    district?: string;
    isActive?: boolean;
    page?: number;
    limit?: number;
  }): Promise<{ users: IUser[]; total: number }> {
    const {
      role,
      state,
      district,
      isActive = true,
      page = 1,
      limit = 10,
    } = filters;

    const query: any = { isActive };

    if (role) query.role = role;
    if (state) query.state = state;
    if (district) query.district = district;

    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      User.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }),
      User.countDocuments(query),
    ]);

    return { users, total };
  }

  async deleteById(id: string): Promise<boolean> {
    const result = await User.findByIdAndDelete(id);
    return result !== null;
  }
}

export const userRepository = new UserRepository();
