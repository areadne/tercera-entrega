import cartModel from "../models/cart.model.js";

export default class CartDAO {
  getAll = async () => await cartModel.find();
  create = async (data) => await cartModel.create(data);
  updateOne = async (id, data) => await cartModel.updateOne(id, data);
  findOneAndUpdate = async (id, data, filter) =>
    await cartModel.findOneAndUpdate(id, data, filter);
  findOne = async (id) =>
    await cartModel.findOne(id).populate("products.product").lean();
}
