import mongoose from "mongoose";

const userCollection = "users";

const userSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  identification: { type: Number, unique: true, required: true },
  // age: { type: Number, required: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  // cart: { type: Number },
  role: { type: String, required: true, default: "usuario" },
  created_at: { type: String, required: true },
  last_connection: { type: String, required: true }
});

const userModel = mongoose.model(userCollection, userSchema);

export default userModel;