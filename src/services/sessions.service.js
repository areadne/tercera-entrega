import SessionDAO from "../dao/sessions.mongo.dao.js";
import sessionRepository from "../repositories/sessions.repository.js";

import ProductDAO from "../dao/product.mongo.dao.js";
import productRepository from "../repositories/product.repository.js";

import UserDAO from "../dao/users.mongo.dao.js";
import userRepository from "../repositories/users.repository.js";

export const UserService = new userRepository(new UserDAO());

import contactDTO from "../dto/contact.dto.js";
import logger from "../helpers/logger.js";

export const SessionService = new sessionRepository(new SessionDAO());
export const ProductService = new productRepository(new ProductDAO());
export const contactDTOManager = new contactDTO();

export class sessionsServiceManager {
  constructor() {}

  readBD = async () => {
    return await SessionService.getAll();
  };

  loginSession = async (request, response) => {

    // console.log(request.session);

    let user = await contactDTOManager.userInformationHandler(
      request,
      response
    );

    if (user.email === undefined) {
      logger.error("LoginSession failed because email is not correct")
      logger.debug("LoginSession failed because user.email is undefined")
      response.redirect("/api/sessions/registro");
      return;
    }

    if (user.password === false) {
      logger.error("LoginSession failed because user or password is not correct")
      logger.debug("LoginSession failed because password is not correct")
      response.status(400).json({
        message: "Usuario o contrase*a incorrecto",
      });
      return;
    }

    response.redirect("/api/sessions/view");
  };

  logoutSession = async (request, response) => {
    // actualizo la hora de la ultima sesion activa del usuario
    const userEmail = request.session.user.email;
    let now = new Date();
    const getUser = await UserService.getAll({ email: userEmail });

    let _id;
    let currentRole;
    let user_name;
    let user_lastname;
    let user_email;
    let user_age;
    let user_pass;
    let user_role;
    let user_created_at

    for (const iterator of getUser) {
      _id = iterator._id;
      currentRole = iterator.role;
      user_name = iterator.first_name;
      user_lastname = iterator.last_name;
      user_email = iterator.email;
      user_age = iterator.age;
      user_pass = iterator.password;
      user_role = iterator.role;
      user_created_at = iterator.created_at

    }

    const userUpdated = {
      first_name: user_name,
      last_name: user_lastname,
      email: user_email,
      age: user_age,
      password: user_pass,
      role: currentRole,
      created_at: user_created_at,
      last_connection: now
    };

    await UserService.updateOne(_id, userUpdated);

    //Elimina la sesion
    request.session.destroy((err) => {
      if (err)
        return response.json({ status: "error", message: "Ocurrio un error" });
      else {
        response.redirect("/api/sessions/login");
      }
    });
  };

  sentUserData = async (request, response) => {
    const userName = request.session.user.first_name;

    let searchUser = await SessionService.getAll({ first_name: userName });
    let userRole = "";
    let cartId = "";

    for (const iterator of searchUser) {
      userRole = iterator.role;
      cartId = iterator.cart;
    }

    const usuario = { user: userName, role: userRole, cart: cartId };

    return usuario;
  };

  loginHandler = async (request, response) => {
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

    let usuario = await this.sentUserData(request, response);
    resultToSend.users = usuario;

    response.render("products", resultToSend);
  };

  currentUser = async (request, response) => {
    let currentUser = request.session.user;

    logger.info(currentUser);
    if (currentUser === undefined) {
      currentUser = { message: "session not registered" };
    }
    response.send(currentUser);
  };
}
