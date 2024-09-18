import CarDAO from "../dao/car.mongo.dao.js";
import carRepository from "../repositories/car.repository.js";
import UserDAO from "../dao/users.mongo.dao.js";
import userRepository from "../repositories/users.repository.js";
import CustomError from "../services/errors/custom_error.js";
import EErrors from "../services/errors/enums.js";
import { generateUserErrorInfo } from "../services/errors/info.js";
import logger from "../helpers/logger.js";


export const CarService = new carRepository(new CarDAO());
export const UserService = new userRepository(new UserDAO());

export class CarServiceManager {
  constructor() { }

  validateData = (argumentToValidate, stringToShow) => {
    if (argumentToValidate) {
      logger.info(stringToShow);
      return;
    }
  };

  readCarDB = async () => {
    return await CarService.getAll();
  };


  addCar = async (request, response, next) => {
    try {
    const {
      car_id,
      brand,
      model,
      year,
      status,
      email,
      extra,
    } = request.body;


    let carIdToUpperCase = car_id.toUpperCase()

    const data = {
      car_id: carIdToUpperCase,
      brand,
      model,
      year,
      status,
      email,
      extra,
    }

    console.log(data)


    if (!car_id || !brand || !model || !year || !email) {
      logger.fatal(
        "addProduct could not be executed because one or more fields are missing: car_id, brand, model, year, email"
      );
      CustomError.createError({
        name: "Creation error",
        cause: generateUserErrorInfo(data),
        message: "Error creating the product",
        code: EErrors.INVALID_TYPES_ERROR,
      });
    }


    let readFile = await this.readCarDB();

    const validateCode = readFile.find((el) => el.car_id === carIdToUpperCase);

    if (validateCode === undefined) {
      let newItemInDB = await CarService.create(data);
      response.send({ status: "success", payload: newItemInDB });

    } else {

      logger.warning(
        "addProduct could not be executed because car_id already exits"
      );
      response.status(400).send({ "status": "something went wrong", payload: "car_id indicated already exits" });
      return;
    }



    } catch(error) {
      next(error);
    }
  };

  getCars = async (request, response) => {

    const carsList = await CarService.getAll();

    console.log(carsList)

    response.send({ "status": "success", payload: carsList })

  }

  getCarById = async (request, response) => {
    const car = request.params.idcar.toUpperCase();

    console.log(car)
    let search = await CarService.getOne({ car_id: car });

    if (search) {
      response.send({ status: "success", payload: search });
    } else {
      response.send({ status: "success", payload: "car does not exits on DB" });
    }
  }
}
