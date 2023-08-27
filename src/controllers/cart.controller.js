import { cartServiceManager } from "../services/cart.service.js";

const serviceManager = new cartServiceManager();

export const createCartController = async (request, response) => {
  serviceManager.createCart(request, response);
};

export const getProductByIdController = async (request, response) => {
  const id = Number(request.params.cid);
  response.send(await serviceManager.getProductById(id, response));
};

export const addProductInCartController = async (request, response) => {
  serviceManager.addProductInCart(request, response);
};

export const deleteProductController = async (request, response) => {
  await serviceManager.deleteProduct(request, response);
};

export const deleteProductsController = async (request, response) => {
  await serviceManager.deleteProducts(request, response);
};

export const updateQtyController = async (request, response) => {
  await serviceManager.updateQty(request, response);
};

export const updateAllCartController = async (request, response) => {
  await serviceManager.updateAllCart(request, response);
};

export const getAllProductsInCartController = async (request, response) => {
  await serviceManager.fullProductsInCart(request, response);
};
