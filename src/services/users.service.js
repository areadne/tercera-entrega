import UserDAO from "../dao/users.mongo.dao.js";
import userRepository from "../repositories/users.repository.js";
import logger from "../helpers/logger.js";
import nodemailer from "nodemailer";
import config from "../config/config.js";
import { createHash, isValidPassword } from "../helpers/utils.js";
import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()

export const UserService = new userRepository(new UserDAO());

export class userServiceManager {
  constructor() { }

  createUser = async (request, response) => {

    console.log(request.body)
    const { first_name, last_name, email, identification, phone, password } = request.body;

    let emailToLowerCase = email.toLowerCase()

    const passwordHash = createHash(password);

    let validateEmail = await userModel.findOne({ email: emailToLowerCase });
    let validateIdentification = await userModel.findOne({ identification: identification });

    if (validateEmail || validateIdentification) {
      console.log("user email or identification number already exits");
      response.send("user email or identification number already exits")
    } else {

      let now = new Date();

      const newUser = await userModel.create({
        first_name,
        last_name,
        email: emailToLowerCase,
        identification,
        phone,
        password: passwordHash,
        role: "usuario",
        created_at: now,
        last_connection: now
      });

      response.send({ status: "user created", pauload: newUser })
    }
  };

  getUser = async (request, response) => {
    const getUsers = await UserService.getAll()

    console.log(getUsers)

    response.send({ status: "success", payload: getUsers })

  }

  getUserById = async (request, response) => {
    const email = request.params.email.toLowerCase();

    let search = await userModel.findOne({ email: email });

    if (search) {
      response.send({ status: "success", payload: search });
    } else {
      response.send({ status: "success", payload: "user does not exits on DB" });
    }

  }

  // changeUser = async (request, response) => {
  //   const id = await request.params.uid;
  //   const newRole = await request.body;

  //   const getUser = await UserService.getAll({ _id: id });

  //   let _id;
  //   let currentRole;
  //   let user_name;
  //   let user_lastname;
  //   let user_email;
  //   let user_age;
  //   let user_pass;
  //   let user_created_at;
  //   let user_last_connection;

  //   for (const iterator of getUser) {
  //     _id = iterator._id;
  //     currentRole = iterator.role;
  //     user_name = iterator.first_name;
  //     user_lastname = iterator.last_name;
  //     user_email = iterator.email;
  //     user_age = iterator.age;
  //     user_pass = iterator.password;
  //     user_created_at = iterator.created_at;
  //     user_last_connection = iterator.last_connection;
  //   }

  //   const userUpdated = {
  //     first_name: user_name,
  //     last_name: user_lastname,
  //     email: user_email,
  //     age: user_age,
  //     password: user_pass,
  //     role: newRole.role,
  //     created_at: user_created_at,
  //     last_connection: user_last_connection,
  //   };

  //   if (currentRole === "admin") {
  //     response.send("This user can not be modified");
  //     return;
  //   }

  //   if (currentRole === "usuario" && newRole.role === "premium") {
  //     await UserService.updateOne(_id, userUpdated);
  //     response.send("Role updated succesfully, new role: premium");
  //     return;
  //   }

  //   if (currentRole === "premium" && newRole.role === "usuario") {
  //     await UserService.updateOne(_id, userUpdated);
  //     response.send("Role updated succesfully, new role: usuario");
  //     return;
  //   }

  //   response.send(`This user already have ${currentRole} role`);
  // };

  // getUsers = async (request, response) => {
  //   let getUser = await UserService.getAll();
  //   let userInfo = [];

  //   for (const iterator of getUser) {
  //     let userData = {
  //       name: iterator.first_name,
  //       email: iterator.email,
  //       rol: iterator.role,
  //     };
  //     userInfo.push(userData);
  //   }

  //   response.send(userInfo);
  // };

  // deleteUser = async (request, response) => {
  //   const user = await UserService.getAll();

  //   const currentDate = new Date();

  //   let user_created_time;
  //   let email;

  //   for (const iterator of user) {
  //     user_created_time = iterator.last_connection;
  //     email = iterator.email;

  //     const userCreatedAt = new Date(user_created_time); // Convierte la fecha de creación de usuario al formato de fecha de JavaScript

  //     const timeDifference = currentDate - userCreatedAt;

  //     const twoDaysInMillis = 2 * 24 * 60 * 60 * 1000; // Calcula el número de milisegundos en dos días

  //     if (timeDifference >= twoDaysInMillis) {
  //       await UserService.deleteOne(iterator._id);

  //       logger.info(`User ${iterator._id} remove from DB`);

  //       let transporter = nodemailer.createTransport({
  //         host: "smtp.gmail.com",
  //         port: 587,
  //         secure: false,
  //         auth: {
  //           user: config.mailer.mailuser,
  //           pass: config.mailer.password,
  //         },
  //       });

  //       let message = {
  //         from: "ceo@coderhouse.com",
  //         to: email,
  //         subject: "Usuario eliminado por inactividad",
  //         html: `
  //             Tu usuario ha sido eliminado por inactividad
  //             `,
  //       };

  //       try {
  //         transporter.sendMail(message);
  //       } catch (error) {
  //         logger.error(error);
  //       }
  //     }
  //   }

  //   response.send("status: success");
  // };


  loginToken = async (request, response) => {

    const { email, password } = request.body;

    let userDBInfo = await userModel.findOne({ email: email });

    const passwordValidation = isValidPassword(password, userDBInfo.password)

    console.log(passwordValidation)

    if (passwordValidation) {
      const user =
      {
        id: userDBInfo.email,
        first_name: userDBInfo.first_name,
        last_name: userDBInfo.last_name,
      }

      console.log(user)

      const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '1h' });
      response.json({ satus: "success", payload: token });

    } else {
      response.status(401).send({ status: "something went wrong", payload: "user or password invalid" });
    }


  };


  validateToken = async (request, response) => {

    const token = request.headers['authorization']

    response.send({ validtoken: token })
  };

  deleteUser = async (request, response) => {

    const { email } = request.body

    console.log(email)
    let validateEmail = await userModel.findOne({ email: email });

    await UserService.deleteOne(validateEmail);

    console.log("user removed");
    response.send("user removed")

  };
}
