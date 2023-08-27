import mongoose, { isValidObjectId } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2"

const ticketCollection = "tickets";

const ticketSchema = new mongoose.Schema({
  code: { type: Number, unique: true, required: true },
  purchase_datetime: { type: String, required: true },
  amount: { type: Number, required: true },
  purchaser: { type: String, required: true }
});

ticketSchema.plugin(mongoosePaginate)
const ticketModel = mongoose.model(ticketCollection, ticketSchema);

export default ticketModel;
