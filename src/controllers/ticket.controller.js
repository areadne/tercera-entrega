import { ticketServiceManager } from "../services/ticket.service.js";

const serviceManager = new ticketServiceManager();

export const createTicketController = async (request, response) => {
  await serviceManager.createTicket(request, response);
};
