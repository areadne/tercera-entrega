import ProductDAO from "../dao/product.mongo.dao.js";
import productRepository from "../repositories/product.repository.js";
import CustomError from "../services/errors/custom_error.js";
import EErrors from "../services/errors/enums.js";
import { generateUserErrorInfo } from "../services/errors/info.js";
import logger from "../helpers/logger.js";

export const ProductService = new productRepository(new ProductDAO());

export class ProductServiceManager {
  constructor() {}

  validateData = (argumentToValidate, stringToShow) => {
    if (argumentToValidate) {
      logger.info(stringToShow);
      return;
    }
  };

  readProductsDB = async () => {
    return await ProductService.getAll();
  };

  limitHandler = async (request, response) => {
    const limit = Number(request.query.limit) || 10;
    const page = Number(request.query.page) || 1;
    const query = request.query.query || "";
    const sort = Number(request.query.sort) || "";

    const result = await ProductService.paginate(
      {},
      { page, limit, lean: true }
    );

    if (sort === 1) {
      const sortedDocsAsc = result.docs.sort((a, b) => a.price - b.price);
      result.docs = sortedDocsAsc;
    } else if (sort === -1) {
      const sortedDocsDesc = result.docs.sort((a, b) => b.price - a.price);
      result.docs = sortedDocsDesc;
    }

    if (query) {
      const filtrado = result.docs.filter((item) => item.category === query);
      result.docs = filtrado;
    }

    result.prevLink = result.hasPrevPage
      ? `/api/sessions/view/?limit=${limit}&page=${result.prevPage}&sort=${sort}&query=${query}`
      : null;
    result.nextLink = result.hasNextPage
      ? `/api/sessions/view/?limit=${limit}&page=${result.nextPage}&sort=${sort}&query=${query}`
      : null;

    const resultToSend = {
      status: "success",
      payload: { docs: result.docs },
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.prevLink,
      nextLink: result.nextLink,
    };

    return resultToSend;
  };

  addProduct = async (request, response, next) => {
    try {
      const {
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
        category,
        status,
      } = request.body;

      const data = request.body;

      if (typeof status != "boolean") {
        logger.fatal(
          "addProduct could not be executed because status is not a boolean"
        );
        CustomError.createError({
          name: "Creation error",
          cause: "Status must be a boolean",
          message: "Error creating the product",
          code: EErrors.INVALID_TYPES_ERROR,
        });
      }

      if (!title || !description || !price || !stock || !code || !category) {
        logger.fatal(
          "addProduct could not be executed because one or more fields are missing: title, description, price, stock, code, category"
        );
        CustomError.createError({
          name: "Creation error",
          cause: generateUserErrorInfo(data),
          message: "Error creating the product",
          code: EErrors.INVALID_TYPES_ERROR,
        });
      }

      let readFile = await this.readProductsDB();

      const validateCode = readFile.find((el) => el.code === code);

      if (validateCode) {
        logger.warning(
          "addProduct could not be executed because validateCode already exits"
        );
        response.status(400).send("Code indicated already exits");
        return;
      }

      let internal_id;

      internal_id =
        readFile.length === 0
          ? 1
          : readFile[readFile.length - 1].internal_id + 1;
      logger.info(internal_id);

      let newItemInDB = await ProductService.create({
        internal_id,
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
        category,
        status,
      });

      response.send({ status: "Successful request", payload: newItemInDB });
    } catch (error) {
      next(error);
    }
  };

  addProductFromSocket = async (request, response) => {
    const {
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
      category,
      status,
    } = request.body;

    if (!title || !description || !price || !stock || !code || !category) {
      logger.error("At least one field is missing");
      return;
    }

    let readFile = await this.readProductsDB();

    const validateCode = readFile.find((el) => el.code === code);

    if (validateCode) {
      logger.error("Code indicated already exits");
      return;
    }

    let internal_id;

    internal_id =
      readFile.length === 0 ? 1 : readFile[readFile.length - 1].internal_id + 1;
    logger.info(internal_id);

    let newItemInDB = await ProductService.create({
      internal_id,
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
      category,
      status,
    });
  };

  getProductById = async (id, response) => {
    let readFile = await this.readProductsDB();

    let search = readFile.find((el) => el.internal_id === id);

    search ? search : (search = "Not found");

    response.send(search);
  };

  updateProduct = async (request, response) => {
    const id = Number(request.params.pid);

    const {
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
      category,
      status,
    } = request.body;

    let readFileToUpdate = await this.readProductsDB();

    const itemFounded = readFileToUpdate.filter(
      (item) => item.internal_id === id
    );

    this.validateData(!itemFounded, "id not found");

    for (const document of itemFounded) {
      // console.log("Documento:", document);
      logger.info("Documento:", document);
      const { _id } = document;

      const nuevoItem = {
        internal_id: id,
        title: title,
        description: description,
        price: price,
        thumbnail: [thumbnail],
        code: code,
        stock: stock,
        category: category,
        status: status,
      };

      await ProductService.updateOne(_id, nuevoItem);
    }

    return;
  };

  deleteProduct = async (request, response) => {
    const id = Number(request.params.pid);

    const readFile = await this.readProductsDB();

    const itemToDelete = readFile.find((item) => item.internal_id === id);

    if (itemToDelete === undefined) {
      response
        .status(400)
        .send(
          "Something went wrong: id did not exist on the list, try with another one"
        );
      return;
    }

    await ProductService.deleteOne(itemToDelete._id);

    response.send({ status: "Id deleted succesfully", payload: itemToDelete });
  };

  deleteProductFromSocket = async (id) => {
    const readFile = await this.readProductsDB();

    const itemToDelete = readFile.find((item) => item.internal_id === id);

    if (itemToDelete === undefined) {
      logger.info("not deleted");
      return;
    }

    await ProductService.deleteOne(itemToDelete._id);
    logger.info("deleted");
  };
}
