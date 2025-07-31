import mongoose, { Model } from 'mongoose';
import {IRide} from './ride.interface'
const rideSchema = new mongoose.Schema({
  rider: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  driver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  pickupLocation: {
    lat: Number,
    lng: Number,
  },
  destinationLocation: {
    lat: Number,
    lng: Number,
  },
  status: {
    type: String,
    enum: ['requested', 'accepted', 'picked_up', 'in_transit', 'completed', 'cancelled'],
    default: 'requested',
  },
  fare: Number,
  timestamps: {
    requestedAt: Date,
    acceptedAt: Date,
    pickedUpAt: Date,
    completedAt: Date,
    cancelledAt: Date,
  },
}, { timestamps: true });

export const Ride: Model<IRide> = mongoose.model<IRide>("Ride", rideSchema);
