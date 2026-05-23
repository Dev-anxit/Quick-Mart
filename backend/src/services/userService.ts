import { prisma } from '../config/prisma';
import { User } from '../types/index';

export class UserService {
  static async findByUid(uid: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { uid },
    }) as Promise<User | null>;
  }

  static async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
    }) as Promise<User | null>;
  }

  static async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
    }) as Promise<User | null>;
  }

  static async create(data: Partial<User>): Promise<User> {
    return prisma.user.create({
      data: {
        uid: data.uid || '',
        email: data.email || '',
        phone: data.phone || '',
        name: data.name || '',
        avatar: data.avatar || null,
        phone_verified: data.phone_verified || false,
      },
    }) as Promise<User>;
  }

  static async updateOTP(userId: string, otp: string, expiryMinutes: number = 10): Promise<User> {
    const expiry = new Date();
    expiry.setMinutes(expiry.getMinutes() + expiryMinutes);

    return prisma.user.update({
      where: { id: userId },
      data: {
        otp,
        otp_expiry: expiry,
      },
    }) as Promise<User>;
  }

  static async verifyOTP(userId: string, otp: string): Promise<boolean> {
    const user = await this.findById(userId);

    if (!user || !user.otp) return false;
    if (user.otp !== otp) return false;
    if (!user.otp_expiry || new Date() > user.otp_expiry) return false;

    await prisma.user.update({
      where: { id: userId },
      data: {
        otp: null,
        otp_expiry: null,
        phone_verified: true,
      },
    });

    return true;
  }

  static async updateProfile(userId: string, data: Partial<User>): Promise<User> {
    return prisma.user.update({
      where: { id: userId },
      data: {
        name: data.name,
        avatar: data.avatar,
        phone: data.phone,
      },
    }) as Promise<User>;
  }

  static async delete(userId: string): Promise<void> {
    await prisma.user.delete({
      where: { id: userId },
    });
  }
}
