import nodemailer from "nodemailer";
import contactDTO from "../dto/contact.dto.js";
import logger from "../helpers/logger.js";
import UserDAO from "../dao/users.mongo.dao.js";
import userRepository from "../repositories/users.repository.js";
import SessionDAO from "../dao/sessions.mongo.dao.js";
import sessionRepository from "../repositories/sessions.repository.js";
import config from "../config/config.js";
import { createHash, isValidPassword } from "../helpers/utils.js";
import userModel from "../models/user.model.js";


export const SessionService = new sessionRepository(new SessionDAO());
export const UserService = new userRepository(new UserDAO());

export const contactDTOManager = new contactDTO();

export class passwordServiceManager {
  constructor() { }

  sendEmail = async (request, response) => {
    const { email } = request.body;
    logger.info(email);

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
      from: "test@lycans.com",
      to: email,
      subject: "Reestablecer clave",
      html: `
      Solicitud de reestablecer clave generado exitosamente, 
      haz clic en el siguiente boton para ejecutar el cambio
      <form action="http://localhost:8080/password/resetearclave">
      <button type="submit">Cambiar clave</button>
      </form>
      `,
    };

    try {
      transporter.sendMail(message);
    } catch (error) {
      logger.error(error);
    }
    response.send({ "status": "success", payload: "Link para recuperar clave enviado al correo del usuario" });
  };


  resetearClave = async (request, response) => {

    const { email, password } = request.body;

    let userDBInfo = await userModel.findOne({ email: email });

    if (userDBInfo === null || undefined) {
      response.status(400).json({
        message: "Email does not exits",
      });
      return;
    }

    const passwordValidation = isValidPassword(password, userDBInfo.password)

    if (passwordValidation) {
      response.status(400).json(
        { "status": "something went wrong", payload: "new password must be diferent to current password" }
      );
      return;
    }

    let readFileToUpdate = await UserService.getAll();
    const itemFounded = readFileToUpdate.filter((item) => item.email === email);

    console.log(itemFounded)

    const passwordHash = createHash(password);
    let now = new Date();

    for (const document of itemFounded) {
      logger.info("Documento:", document);
      const { _id, first_name, last_name, email, identification, password, role, created_at, last_connection } = document;
      console.log(_id)

      const userUpdated = {
        first_name: first_name,
        last_name: last_name,
        email: email,
        identification: identification,
        password: passwordHash,
        role: role,
        created_at: created_at,
        last_connection: now
      };

      console.log(userUpdated)

      await SessionService.updateOne(_id, userUpdated);
    }

    response.send({status: "success", payload: "Update completed"})
  }


}
