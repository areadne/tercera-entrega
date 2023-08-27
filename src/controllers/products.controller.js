import { ProductServiceManager } from "../services/product.service.js"
const serviceManager = new ProductServiceManager()

export const limitHandlerController = async (request, response) => {
  response.send(await serviceManager.limitHandler(request, response));
};

export const getProductByIdController = async (request, response) => {
  const id = Number(request.params.pid);
  await serviceManager.getProductById(id, response);
};

export const addProductController = async (request, response) => {
  await serviceManager.addProduct(request, response);
};

export const updateProductController = async (request, response) => {
  await serviceManager.updateProduct(request, response);
};

export const deleteProductController = async (request, response) => {
  await serviceManager.deleteProduct(request, response);
};
