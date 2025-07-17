import jwt from 'jsonwebtoken';
import { IUser } from '@/types/user';

const JWT_SECRET = process.env.JWT_SECRET!;

export function generateToken(user: IUser) {
  return jwt.sign(
    { id: user._id, email: user.email },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function verifyToken(token: string) {
  return jwt.verify(token, JWT_SECRET);
}
