import productsModel from "../models/products.model.js";

export default class ProductDAO {
  getAll = async () => await productsModel.find().lean();
  create = async (data) => await productsModel.create(data);
  updateOne = async (id, data) => await productsModel.findOneAndUpdate(id, data);
  deleteOne = async (id) => await productsModel.deleteOne(id);
  paginate = async (data, details) => await productsModel.paginate(data, details);
}
