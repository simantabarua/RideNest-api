import { Types } from 'mongoose';

export interface IRideRequest {
  pickupLocation: string;
  destinationLocation: string;
}

export interface IRide extends IRideRequest {
  rider: Types.ObjectId;
  driver?: Types.ObjectId;
  status: 'requested' | 'accepted' | 'picked_up' | 'in_transit' | 'completed' | 'cancelled';
  fare?: number;
  timestamps: {
    requestedAt: Date;
    acceptedAt?: Date;
    pickedUpAt?: Date;
    completedAt?: Date;
    cancelledAt?: Date;
  };
}
