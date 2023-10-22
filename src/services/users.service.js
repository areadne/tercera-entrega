import UserDAO from "../dao/users.mongo.dao.js";
import userRepository from "../repositories/users.repository.js";
import logger from "../helpers/logger.js";
import nodemailer from "nodemailer";
import config from "../config/config.js";

export const UserService = new userRepository(new UserDAO());

export class userServiceManager {
  constructor() {}
  
  changeUser = async (request, response) => {
    const id = await request.params.uid;
    const newRole = await request.body;

    const getUser = await UserService.getAll({ _id: id });

    let _id;
    let currentRole;
    let user_name;
    let user_lastname;
    let user_email;
    let user_age;
    let user_pass;
    let user_created_at;
    let user_last_connection;

    for (const iterator of getUser) {
      _id = iterator._id;
      currentRole = iterator.role;
      user_name = iterator.first_name;
      user_lastname = iterator.last_name;
      user_email = iterator.email;
      user_age = iterator.age;
      user_pass = iterator.password;
      user_created_at = iterator.created_at;
      user_last_connection = iterator.last_connection;
    }

    const userUpdated = {
      first_name: user_name,
      last_name: user_lastname,
      email: user_email,
      age: user_age,
      password: user_pass,
      role: newRole.role,
      created_at: user_created_at,
      last_connection: user_last_connection,
    };

    if (currentRole === "admin") {
      response.send("This user can not be modified");
      return;
    }

    if (currentRole === "usuario" && newRole.role === "premium") {
      await UserService.updateOne(_id, userUpdated);
      response.send("Role updated succesfully, new role: premium");
      return;
    }

    if (currentRole === "premium" && newRole.role === "usuario") {
      await UserService.updateOne(_id, userUpdated);
      response.send("Role updated succesfully, new role: usuario");
      return;
    }

    response.send(`This user already have ${currentRole} role`);
  };

  getUsers = async (request, response) => {
    let getUser = await UserService.getAll();
    let userInfo = [];

    for (const iterator of getUser) {
      let userData = {
        name: iterator.first_name,
        email: iterator.email,
        rol: iterator.role,
      };
      userInfo.push(userData);
    }

    response.send(userInfo);
  };

  deleteUser = async (request, response) => {
    const user = await UserService.getAll();

    const currentDate = new Date();

    let user_created_time;
    let email;

    for (const iterator of user) {
      user_created_time = iterator.last_connection;
      email = iterator.email;

      const userCreatedAt = new Date(user_created_time); // Convierte la fecha de creación de usuario al formato de fecha de JavaScript

      const timeDifference = currentDate - userCreatedAt;

      const twoDaysInMillis = 2 * 24 * 60 * 60 * 1000; // Calcula el número de milisegundos en dos días

      if (timeDifference >= twoDaysInMillis) {
        await UserService.deleteOne(iterator._id);

        logger.info(`User ${iterator._id} remove from DB`);
        
        let transporter = nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 587,
          secure: false,
          auth: {
            user: config.mailer.mailuser,
            pass: config.mailer.password,
          },
        });

        let message = {
          from: "ceo@coderhouse.com",
          to: email,
          subject: "Usuario eliminado por inactividad",
          html: `
              Tu usuario ha sido eliminado por inactividad
              `,
        };

        try {
          transporter.sendMail(message);
        } catch (error) {
          logger.error(error);
        }
      }
    }

    response.send("status: success");
  };
}
