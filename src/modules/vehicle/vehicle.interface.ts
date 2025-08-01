export enum VehicleType {
  CAR = "car",
  BIKE = "bike",
  SCOOTER = "scooter",
}

export interface IVehicleInfo {
  type: VehicleType;
  model: string;
  registrationNumber: string;
}
