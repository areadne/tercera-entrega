import paymentsModel from "../models/payments.model.js";

export default class PaymentsDAO {
  getAll = async () => await paymentsModel.find().lean();
  // getAll = async () => await paymentsModel.find().lean;
  create = async (data) => await paymentsModel.create(data);
  getOne = async (data) => await paymentsModel.find(data).lean().exec();
  updateOne = async (id, data) => await paymentsModel.findOneAndUpdate(id, data);
  deleteOne = async (id) => await paymentsModel.deleteOne(id);
}