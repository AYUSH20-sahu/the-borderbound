import mongoose, { Schema, Document, Model } from "mongoose";

export interface IContactInquiry extends Document {
  inquiryId: string;
  fullName: string;
  email: string;
  organization?: string;
  category: "brand_sponsorship" | "press_media" | "broadcast_licensing" | "casting_inquiry" | "general";
  message: string;
  status: "new" | "in_review" | "replied" | "archived";
  createdAt: Date;
  updatedAt: Date;
}

const ContactInquirySchema: Schema<IContactInquiry> = new Schema(
  {
    inquiryId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true, index: true },
    organization: { type: String, trim: true },
    category: {
      type: String,
      enum: ["brand_sponsorship", "press_media", "broadcast_licensing", "casting_inquiry", "general"],
      required: true,
    },
    message: { type: String, required: true, maxlength: 3000 },
    status: {
      type: String,
      enum: ["new", "in_review", "replied", "archived"],
      default: "new",
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export const ContactInquiry: Model<IContactInquiry> =
  mongoose.models.ContactInquiry ||
  mongoose.model<IContactInquiry>("ContactInquiry", ContactInquirySchema);
