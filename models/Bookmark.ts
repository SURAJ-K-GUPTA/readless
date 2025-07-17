// This file defines the Bookmark model for MongoDB using Mongoose.

import mongoose, { Schema } from "mongoose";
import { IBookmark } from "@/types/bookmark";

const BookmarkSchema = new Schema<IBookmark>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    url: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: false,
    },
    favicon: {
      type: String,
      default: "",
      required: false,
    },
    summary: {
      type: String,
      required: false,
    },
    tags: {
      type: [String],
      default: [],
      required: false,
    },
    orderIndex: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Bookmark || mongoose.model<IBookmark>("Bookmark", BookmarkSchema);
