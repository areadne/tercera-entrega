import { paymentServiceManager } from "../services/payments.service.js";

const managerUser = new paymentServiceManager();

export const uploadPaymentController = async (request, response) => {
  await managerUser.uploadPayment(request, response);
};

export const getPaymentsController = async (request, response) => {
  await managerUser.getPayment(request, response);
};

export const getPaymentByEmailController = async (request, response) => {
  await managerUser.getPaymentByEmail(request, response);
};

