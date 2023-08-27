import chatRepository from "../repositories/chat.repository.js";
import MessagesDAO from "../dao/chat.mongo.dao.js";

export const chatService = new chatRepository(new MessagesDAO());

export class chatServiceManager {
  constructor() {}

  readMessages = async () => {
    return await chatService.getAll();
  };
}
