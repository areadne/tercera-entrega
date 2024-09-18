import carModel from "../models/car.model.js";

export default class CarDAO {
  getAll = async () => await carModel.find().lean();
  getOne = async (data) => await carModel.findOne(data);
  create = async (data) => await carModel.create(data);
  updateOne = async (id, data) => await carModel.findOneAndUpdate(id, data);
  deleteOne = async (id) => await carModel.deleteOne(id);
  paginate = async (data, details) => await carModel.paginate(data, details);
}
