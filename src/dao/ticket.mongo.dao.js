import ticketModel from "../models/ticket.model.js";

export default class TicketDAO {
  getAll = async () => await ticketModel.find().lean();
  create = async (data) => await ticketModel.create(data)
}
