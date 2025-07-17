// This file defines the IBookmark interface for a bookmark document in MongoDB.
// It includes properties such as userId, url, title, favicon, summary, tags, orderIndex, createdAt, and updatedAt.
import { Document, Types } from "mongoose";

export interface IBookmark extends Document {
  userId: Types.ObjectId;
  url: string;
  title: string;
  favicon?: string;
  summary: string;
  tags?: string[];
  orderIndex?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
