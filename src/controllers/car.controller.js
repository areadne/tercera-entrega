import { CarServiceManager } from "../services/car.service.js"
const serviceManager = new CarServiceManager()

export const addCarController = async (request, response, next) => {
  await serviceManager.addCar(request, response, next);
};

export const getCarController = async (request, response, next) => {
  await serviceManager.getCars(request, response, next);
};

export const getCarByIdController = async (request, response) => {
  await serviceManager.getCarById(request, response);
};