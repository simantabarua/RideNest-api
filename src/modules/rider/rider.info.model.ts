import mongoose, { Schema, Types, Model } from "mongoose";

interface IRiderInfo {
  rider: Types.ObjectId;
  completedRides: number;
  cancelledRides: number;
  totalRides: number;
}

const riderInfoSchema = new Schema<IRiderInfo>({
  rider: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true, 
  },
  completedRides: {
    type: Number,
    default: 0,
  },
  cancelledRides: {
    type: Number,
    default: 0,
  },
  totalRides: {
    type: Number,
    default: 0,
  },
});

const RiderInfo: Model<IRiderInfo> = mongoose.model<IRiderInfo>(
  "RiderInfo",
  riderInfoSchema
);

export default RiderInfo;
