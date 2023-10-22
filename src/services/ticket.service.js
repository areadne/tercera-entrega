import TicketDAO from "../dao/ticket.mongo.dao.js";
import TicketRepository from "../repositories/ticket.repository.js";
import { cartServiceManager } from "./cart.service.js";
import { ProductServiceManager } from "./product.service.js";
import ProductDAO from "../dao/product.mongo.dao.js";
import productRepository from "../repositories/product.repository.js";
import { sessionsServiceManager } from "./sessions.service.js";
import logger from "../helpers/logger.js";

export const ProductService = new productRepository(new ProductDAO());

export const ticketService = new TicketRepository(new TicketDAO());
const cartManager = new cartServiceManager();
const productManager = new ProductServiceManager();
const managerUser = new sessionsServiceManager();

export class ticketServiceManager {
  constructor() {}

  cartDetail = async (request, response) => {
    const id = Number(request.params.cid);
    logger.info(id);
    return await cartManager.getProductById(id);
  };

  stockHandler = async (request, response) => {
    let getCartDetail = await this.cartDetail(request, response);
    let readProductDB = await ProductService.getAll();
    let search;
    let newArray = [];
    let amount;
    let producUpdate = "";
    let title;
    let description;
    let price;
    let stock;
    let thumbnail;
    let code;
    let stockUpdated;
    let category;
    let status;

    for (const iterator of getCartDetail.products) {
      search = readProductDB.find((el) => el.internal_id === iterator.product);
      stockUpdated = search.stock - iterator.quantity;

      if (stockUpdated > 0) {
        title = search.title;
        description = search.description;
        price = search.price;
        thumbnail = search.thumbnail[0];
        code = search.code;
        stock = stockUpdated;
        category = search.category;
        status = search.status;

        producUpdate = {
          title,
          description,
          price,
          thumbnail,
          code,
          stock,
          category,
          status,
        };

        request.body = producUpdate;
        request.params.pid = iterator.product;

        newArray.push({ ...iterator, ...search });

        amount = newArray.reduce((acc, item) => {
          return acc + item.quantity * item.price;
        }, 0);

        //actualizo el stock del producto
        await productManager.updateProduct(request, response);

        //elimino el producto del carrito
        request.params.cid = getCartDetail.id;

        await cartManager.deleteProduct(request, response);
      }
    }

    if (amount === undefined) {
      amount = 0;
    }
    return amount;
  };

  createTicket = async (request, response) => {
    let amount = await this.stockHandler(request, response);

    if (amount === 0) {
      logger.debug("createTicket failed because amount is 0")
      logger.fatal("createTicket failed because we do not have stock")
      response.send(
        "No se pudo finalizar compra ya que no contamos con stock de los productos seleccionados"
      );
      return;
    }

    let purchaser = request.session.user.email;
    let purchase_datetime = new Date();
    let code;
    let readTicketCollection = await ticketService.getAll();

    code =
      readTicketCollection.length === 0
        ? 1
        : readTicketCollection[readTicketCollection.length - 1].code + 1;

    await ticketService.create({
      code,
      purchase_datetime,
      amount,
      purchaser,
    });

    let validateProducts = await this.cartDetail(request, response);

    let products = validateProducts.products;

    let readTicketDetails = await ticketService.getAll();

    let getTicketDetails = readTicketDetails.filter(
      (item) => item.code === code
    );

    if (products === undefined || products.length === 0) {
      response.render("purchasecomplete", { getTicketDetails });
      return
    }

    if (products.length >= 1) {
      let user = await managerUser.sentUserData(request, response);
      user.getTicketDetails = getTicketDetails;
      response.render("purchaseincomplete", user);
      return
    }
  };
}
