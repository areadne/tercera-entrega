import mongoose, { isValidObjectId } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2"

const productsMockingCollection = "mockingProducts";

const productsMockingSchema = new mongoose.Schema({
  internal_id: { type: Number, unique: true, required: true},
  title: { type: String, required: true},
  description: { type: String, required: true},
  price: { type: Number, required: true},
  thumbnail: { type: Array, required: true},
  code: { type: Number, unique: true, required: true },
  stock: { type: Number, required: true},
  category: { type: String, required: true},
  status: { type: Boolean, default: true},
}
);

productsMockingSchema.plugin(mongoosePaginate)
const productsMockingModel = mongoose.model(productsMockingCollection, productsMockingSchema)

export default productsMockingModel