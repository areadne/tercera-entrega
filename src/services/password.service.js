import nodemailer from "nodemailer";
import contactDTO from "../dto/contact.dto.js";
import logger from "../helpers/logger.js";
import { createHash } from "../helpers/utils.js";
import SessionDAO from "../dao/sessions.mongo.dao.js";
import sessionRepository from "../repositories/sessions.repository.js";
import config from "../config/config.js";

export const SessionService = new sessionRepository(new SessionDAO());

export const contactDTOManager = new contactDTO();

export class passwordServiceManager {
  constructor() {}

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
      from: "ceo@coderhouse.com",
      to: email,
      subject: "Reestablecer contrase*a",
      html: `
      Solicitud de reestablecer contrase*a generado exitosamente, 
      haz clic en el siguiente boton para ejecutar el cambio
      <form action="http://localhost:8080/mail/resetearclave">
      <button type="submit">Cambiar clave</button>
      </form>
      `,
    };

    try {
      transporter.sendMail(message);
    } catch (error) {
      logger.error(error);
    }
    response.send("Link para recuperar clave enviado al correo");
  };


  resetearClave = async (request, response) => {
      const { email, password } = request.body;
      //se debe pasar email, password en el body
      let user = await contactDTOManager.userInformationHandler(request, response);
    
      if (user.email === undefined) {
        logger.error("Email does not exits");
        logger.debug("Can not continue because Email does not exits on data base");
        response.status(400).json({
            message: "Email does not exits",
          });
        return;
      }
    
      if (user.password === true) {
        logger.error("Password must be diferent to previous");
        logger.debug(
          "Password indicated by user is the same that already exits on data base"
        );
        response.status(400).json({
          message: "La contrase*a debe ser distinta a la actual",
        });
        return;
      }
    
      let readFileToUpdate = await SessionService.getAll();
    
      const itemFounded = readFileToUpdate.filter((item) => item.email === email);
      const passwordHash = createHash(password);
    
      for (const document of itemFounded) {
        logger.info("Documento:", document);
        const { _id, first_name, last_name, age, cartId, role } = document;
    
        const userUpdated = {
          first_name: first_name,
          last_name: last_name,
          email: email,
          age: age,
          password: passwordHash,
          cart: cartId,
          role: role,
        };
    
        await SessionService.updateOne(_id, userUpdated);
      }
      
      response.send('contrase*a actualizada exitosamente')
  }


}
