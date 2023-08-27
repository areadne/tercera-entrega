import ProductDAO from "../dao/product.mongo.dao.js";
import productRepository from "../repositories/product.repository.js";
import CartDAO from "../dao/cart.mongo.dao.js";
import cartRepository from "../repositories/cart.repository.js";
import { ProductServiceManager } from "./product.service.js";
import { sessionsServiceManager } from "./sessions.service.js";

export const cartService = new cartRepository(new CartDAO());
export const ProductService = new productRepository(new ProductDAO());
const ProductsServiceManager = new ProductServiceManager();
const serviceManager = new sessionsServiceManager();

export class cartServiceManager {
  constructor() {}

  createCart = async (request, response) => {
    let id;
    let readFile = await cartService.getAll();

    id = readFile.length === 0 ? 1 : readFile[readFile.length - 1].id + 1;

    await cartService.create({ id });

    response.send("cart created");
  };

  validateParams = async (request, response) => {
    const cid = Number(request.params.cid);
    const pid = Number(request.params.pid);

    const readCartFile = await cartService.getAll();
    const readProductsFile = await ProductService.getAll();

    const validateCid = readCartFile.find((item) => item.id === cid);
    const validatePid = readProductsFile.find(
      (item) => item.internal_id === pid
    );

    let validations = {
      validateCid: validateCid,
      validatePid: validatePid,
      pid: pid,
      cid: cid,
    };

    return validations;
  };

  fullProductsInCart = async (request, response) => {
    const id = Number(request.params.cid);
    const result = await this.getProductById(id, response);
    let newArray = [];
    let readProductDB = await ProductService.getAll();
    let amount;

    for (const iterator of result.products) {
      let search = readProductDB.find(
        (el) => el.internal_id === iterator.product
      );
      newArray.push({ ...iterator, ...search });

      amount = newArray.reduce((acc, item) => {
        return acc + item.quantity * item.price;
      }, 0);
    }

    let user = await serviceManager.sentUserData(request, response);

    newArray.amount = amount;
    newArray.cart = user.cart;

    response.render("cart", { newArray });
  };

  getProductById = async (id, response) => {
    let search = await cartService.findOne({ id: id });
    search ? search : (search = "Not found");
    return search;
  };

  addProductInCart = async (request, response) => {
    const cid = Number(request.params.cid);
    const pid = Number(request.params.pid);

    const readCartFile = await cartService.getAll();
    const readProductsFile = await ProductService.getAll();

    const validateCid = readCartFile.find((item) => item.id === cid);
    const validatePid = readProductsFile.find(
      (item) => item.internal_id === pid
    );

    if (validateCid === undefined || validatePid === undefined) {
      response.status(400).send("Cart or product id does not exist");
      return;
    }

    const validatePidInArray = validateCid.products.find(
      (item) => item.product === Number(pid) || item._id === pid
    );

    const result = await this.getProductById(cid, response);

    if (validateCid.products.length === 0 || validatePidInArray === undefined) {
      await cartService.findOneAndUpdate(validateCid._id, {
        $push: { products: [{ product: pid, quantity: 1 }] },
      });

      response.send("Cart updated successfully");
      return;
    }

    if (validatePidInArray) {
      await cartService.findOneAndUpdate(
        { _id: validateCid._id },
        {
          $set: {
            "products.$[element].quantity": validatePidInArray.quantity + 1,
          },
        },
        { arrayFilters: [{ "element._id": validatePidInArray._id }] }
      );

      response.send("Cart updated successfully");
      return;
    }
  };

  deleteProduct = async (request, response) => {
    const validations = await this.validateParams(request, response);

    const { validateCid, validatePid, pid, cid } = validations;

    if (validateCid === undefined || validatePid === undefined) {
      response.status(400).send("Cart or product id does not exist");
      return;
    }

    const validatePidInArray = validateCid.products.find(
      (item) => item.product === pid
    );

    if (validateCid.products.length === 0 || validatePidInArray === undefined) {
      response.send("Product does not exits in the cart");
      return;
    }

    if (validatePidInArray) {
      await cartService.updateOne(
        { _id: validateCid._id },
        { $pull: { products: { _id: validatePidInArray._id } } }
      );

      // response.send("Cart updated successfully");
      return;
    }
  };

  deleteProducts = async (request, response) => {
    const cid = Number(request.params.cid);

    const readCartFile = await cartService.getAll();

    const validateCid = readCartFile.find((item) => item.id === cid);

    if (validateCid === undefined) {
      response.status(400).send("Cart does not exist");
      return;
    }

    await cartService.updateOne({ _id: validateCid._id }, { products: [] });

    response.send("Cart updated successfully");
    return;
  };

  updateQty = async (request, response) => {
    const { quantity } = request.body;

    const validations = await this.validateParams(request, response);

    const { validateCid, validatePid, pid, cid } = validations;

    if (validateCid === undefined || validatePid === undefined) {
      response.status(400).send("Cart or product id does not exist");
      return;
    }

    const validatePidInArray = validateCid.products.find(
      (item) => item.product === pid
    );

    if (validateCid.products.length === 0 || validatePidInArray === undefined) {
      response.send("Product does not exits in the cart");
      return;
    }

    if (validatePidInArray) {
      await cartService.findOneAndUpdate(
        { _id: validateCid._id },
        {
          $set: {
            "products.$[element].quantity": quantity,
          },
        },
        { arrayFilters: [{ "element._id": validatePidInArray._id }] }
      );

      response.send("Cart updated successfully");
      return;
    }
  };

  updateAllCart = async (request, response) => {
    const cid = Number(request.params.cid);
    const { products } = request.body;

    const readCartFile = await cartService.getAll();

    const validateCid = readCartFile.find((item) => item.id === cid);

    if (validateCid === undefined) {
      response.status(400).send("Cart does not exist");
      return;
    }

    await cartService.updateOne(
      { _id: validateCid._id },
      { products: products }
    );

    response.send("Cart updated successfully");
    return;
  };
}
