import messageModel from "../models/messages.model.js";

export default class MessagesDAO {
  getAll = async () => await messageModel.find().lean();
}
