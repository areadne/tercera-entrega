import mongoose, { isValidObjectId } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2"

const carCollection = "cars";

const carSchema = new mongoose.Schema({
//   internal_id: { type: Number, unique: true, required: true},
  car_id: { type: String, required: true},
  brand: { type: String, required: true},
  model: { type: String, required: true},
  year: { type: Number, required: true},
  status: { type: Boolean, default: false},
  email: { type: String, required: true },
  extra: { type: Array }
}
);

carSchema.plugin(mongoosePaginate)
const carModel = mongoose.model(carCollection, carSchema)


export default carModel