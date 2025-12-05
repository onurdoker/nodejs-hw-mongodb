import { Schema, model } from "mongoose";

const sessionsCollectionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "contacts",
      required: true,
    },
    accessToken: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
      required: true,
    },
    accessTokenValidUntil: {
      type: Date,
      required: true,
    },
    refreshTokenValidUntil: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const SessionsCollection = model("sessions", sessionsCollectionSchema);

export default SessionsCollection;
