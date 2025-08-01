import User from "./user.model";
import createUser from "./user.service/create.user.service";
import UpdateUser from "./user.service/update.user.serive";

const getAllUsers = async () => {
  const users = await User.find();
  return users;
};

export const UserService = {
  createUser,
  getAllUsers,
  UpdateUser,
};
