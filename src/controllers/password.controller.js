import { passwordServiceManager } from "../services/password.service.js";

const serviceManager = new passwordServiceManager();

export const sendEmailController = async (request, response) => {
  serviceManager.sendEmail(request, response);
};

export const resetearClaveController = async (request, response) => {
  serviceManager.resetearClave(request, response);
};
