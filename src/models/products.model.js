import mongoose, { isValidObjectId } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2"

const productsCollection = "products";

const productsSchema = new mongoose.Schema({
  internal_id: { type: Number, unique: true, required: true},
  car_id: { type: String, required: true},
  brand: { type: String, required: true},
  model: { type: String, required: true},
  year: { type: Number, required: true},
  status: { type: Boolean, default: false},
  email: { type: String, required: true },
  extra: { type: Array }
  // email: { type: String, required: true },
  // code: { type: Number, unique: true, required: true },
  // stock: { type: Number, required: true},
  // category: { type: String, required: true},
}
);

productsSchema.plugin(mongoosePaginate)
const productsModel = mongoose.model(productsCollection, productsSchema)


export default productsModel