// This file defines the IUser interface for a user document in MongoDB.
// It includes properties such as _id, email, passwordHash, and createdAt.
import { Document } from "mongoose";

export interface IUser extends Document {
  _id: string;
  email: string;
  passwordHash?: string;
  createdAt?: string;
}
