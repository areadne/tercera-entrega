import { isValidPassword } from "../helpers/utils.js";
import sessionRepository from "../repositories/sessions.repository.js";
import SessionDAO from "../dao/sessions.mongo.dao.js";

export const SessionService = new sessionRepository(new SessionDAO())

export default class contactDTO {
    constructor() {}

    userInformationHandler = async (request, response) => {
        const { email, password } = request.body;
        const validateEmailExits = await SessionService.getAll({ email });

        let dbPassword = "";
    
        for (const iterator of validateEmailExits) {
          const { password } = iterator;
          dbPassword = password;
        }
    
        const validatePassword = isValidPassword(password, dbPassword);
    
        let first_nameCapture;
        let roleCapture;
        let emailCapture
        let passwordValidate
    
        for (const iterator of validateEmailExits) {
          const { first_name, role, email } = iterator;
          first_nameCapture = first_name;
          roleCapture = role;
          emailCapture = email
          passwordValidate = validatePassword
        }
    
        const user = {
          first_name: first_nameCapture,
          role: roleCapture,
          email: emailCapture,
          password: passwordValidate
        };
    
        request.session.user = user;
        return user
    }
}