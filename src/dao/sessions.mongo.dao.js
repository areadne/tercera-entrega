import userModel from "../models/user.model.js";

export default class SessionDAO {
  getAll = async (data) => await userModel.find(data).lean().exec();
}
