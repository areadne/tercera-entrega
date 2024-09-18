import userModel from "../models/user.model.js";

export default class UserDAO {
  create = async (data) => await userModel.create(data);
  getAll = async (data) => await userModel.find(data).lean().exec();
  updateOne = async (id, data) => await userModel.findOneAndUpdate(id, data);
  deleteOne = async (id) => await userModel.deleteOne(id);
}