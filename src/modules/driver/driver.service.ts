import AppError from "../../errorHelper/AppError";
import { StatusCodes } from "http-status-codes";
import { DriverInfo } from "./driver.model";
import { Types } from "mongoose";
import { QueryBuilder } from "../../utils/QueryBuilder";
import User from "../user/user.model";

export const getPublicDrivers = async (query: Record<string, string>) => {
  const queryObj = { ...query };
  const searchTerm = queryObj.searchTerm || "";

  const matchConditions: any[] = [];
  if (searchTerm) {
    const matchingUsers = await User.find({
      role: "driver",
      name: { $regex: searchTerm, $options: "i" },
    }).select("_id");
    const userIds = matchingUsers.map((u) => u._id);

    matchConditions.push({
      $or: [
        { driver: { $in: userIds } },
        { "vehicleInfo.model": { $regex: searchTerm, $options: "i" } },
      ],
    });
  }

  const filterConditions: any = {};
  if (queryObj.type) {
    filterConditions["vehicleInfo.type"] = queryObj.type;
  }
  if (queryObj.isAvailable !== undefined) {
    filterConditions["isAvailable"] = queryObj.isAvailable === "true";
  }

  let finalQuery = DriverInfo.find();
  if (matchConditions.length > 0) {
    finalQuery = finalQuery.find({ $and: [...matchConditions, filterConditions] });
  } else {
    finalQuery = finalQuery.find(filterConditions);
  }

  finalQuery = finalQuery.populate("driver", "name email phone photo");

  const cleanQueryForBuilder = { ...queryObj };
  delete cleanQueryForBuilder.type;
  delete cleanQueryForBuilder.isAvailable;
  delete cleanQueryForBuilder.searchTerm;

  const builder = new QueryBuilder(finalQuery, cleanQueryForBuilder)
    .sort()
    .paginate();

  const data = await builder.build();
  const meta = await builder.getMeta();

  return { data, meta };
};

export const getDriverById = async (id: string) => {
  const driver = await DriverInfo.findById(id).populate("driver", "name email phone photo");
  if (!driver) {
    throw new AppError("Driver not found", StatusCodes.NOT_FOUND);
  }
  return driver;
};

export const setAvailability = async (
  driverId: string,
  isAvailable: boolean
) => {
  const updated = await DriverInfo.findOneAndUpdate(
    {
      $or: [{ driver: driverId }, { driver: new (Types.ObjectId as any)(driverId) }],
    },
    { $set: { isAvailable } },
    { new: true }
  );

  if (!updated) {
    throw new AppError("Driver not found", StatusCodes.NOT_FOUND);
  }

  return { isAvailable: updated.isAvailable };
};

export const isAvailable = async (driverId: string) => {
  const driver = await DriverInfo.findOne({
    driver: new (Types.ObjectId as any)(driverId),
  });

  if (!driver) {
    throw new AppError("Driver not found", StatusCodes.NOT_FOUND);
  }

  return { isAvailable: driver.isAvailable };
};

export const DriverService = {
  getPublicDrivers,
  getDriverById,
  setAvailability,
  isAvailable,
};
