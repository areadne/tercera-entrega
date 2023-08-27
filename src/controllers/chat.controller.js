import { chatServiceManager } from "../services/chat.service.js";

const chatService = new chatServiceManager();

export const chatController = async (resq, resp) => {
  const response = await chatService.readMessages();
  resp.render("chat", { response });
};
