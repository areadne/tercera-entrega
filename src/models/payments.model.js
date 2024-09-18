import mongoose, { isValidObjectId } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2"

const paymentsCollection = "payments";

const paymentsSchema = new mongoose.Schema({
    purchaser_email: { type: String, required: true },
    issuing_bank: { type: String, required: true },
    // receiving_bank: { type: String, required: true },
    // receiving_identification: { type: Number, unique: true, required: true },
    issuing_phone_number: { type: String, required: true },
    // receiving_phone_number: { type: Number, unique: true, required: true },
    reference_number: { type: String, required: true },
    purchase_datetime: { type: String, required: true },
    amount: { type: Number, required: true },
    // comments: { type: String, required: true },
    img: { type: String, required: true },
});

paymentsSchema.plugin(mongoosePaginate)
const paymentsModel = mongoose.model(paymentsCollection, paymentsSchema);

export default paymentsModel;