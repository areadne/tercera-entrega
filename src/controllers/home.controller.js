import { ProductServiceManager } from "../services/product.service.js";

const serviceManager = new ProductServiceManager();

export const homeController = async (request, response) => {
  const products = await serviceManager.readProductsDB();
  response.render("home", { products });
};

export const productsController = async (request, response) => {
  response.render("manageproducts", {});
};
