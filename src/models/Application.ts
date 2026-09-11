import mongoose, { Schema, Document, Model } from "mongoose";

export type ApplicationStatus =
  | "pending"
  | "under_review"
  | "shortlisted"
  | "rejected"
  | "selected";

export interface IApplication extends Document {
  applicationId: string; // e.g. BB-2026-98124
  applicant: {
    fullName: string;
    email: string;
    phone: string;
    age: number;
    occupation: string;
    hometown: string;
    hasValidPassport: boolean;
    googleId?: string;
  };
  media: {
    photoUrl: string;
    videoAuditionUrl: string;
    videoDurationSeconds?: number;
  };
  pitch: {
    sectorPreference: string;
    archetypePreference: string;
    strategyPitch: string;
    survivalExperience: string;
    whyBorderbound: string;
  };
  status: ApplicationStatus;
  internalNotes?: string;
  reviewedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ApplicationSchema: Schema<IApplication> = new Schema(
  {
    applicationId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    applicant: {
      fullName: { type: String, required: true, trim: true },
      email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        index: true,
      },
      phone: { type: String, required: true, trim: true },
      age: { type: Number, required: true, min: 21 },
      occupation: { type: String, required: true, trim: true },
      hometown: { type: String, required: true, trim: true },
      hasValidPassport: { type: Boolean, default: false },
      googleId: { type: String, sparse: true },
    },
    media: {
      photoUrl: { type: String, required: true },
      videoAuditionUrl: { type: String, required: true },
      videoDurationSeconds: { type: Number },
    },
    pitch: {
      sectorPreference: { type: String, required: true },
      archetypePreference: { type: String, required: true },
      strategyPitch: { type: String, required: true, maxlength: 2000 },
      survivalExperience: { type: String, required: true, maxlength: 2000 },
      whyBorderbound: { type: String, required: true, maxlength: 2000 },
    },
    status: {
      type: String,
      enum: ["pending", "under_review", "shortlisted", "rejected", "selected"],
      default: "pending",
      index: true,
    },
    internalNotes: { type: String, default: "" },
    reviewedBy: { type: String },
  },
  {
    timestamps: true,
  }
);

// Prevent re-compiling the model in Next.js hot-reload
export const Application: Model<IApplication> =
  mongoose.models.Application ||
  mongoose.model<IApplication>("Application", ApplicationSchema);
