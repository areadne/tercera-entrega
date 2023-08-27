import contactDTO from "../dto/contact.dto.js";
import config from "../config/config.js";

export const contactHadler = new contactDTO();

export const adminRoutes = (request, response, next) => {
  let user = request.session.user.email;
  if (user === config.system.admin) {
    next();
  } else {
    response.redirect("/api/sessions/view");
  }
};

export const chatUserRoutes = (request, response, next) => {
  let user = request.session.user.role;
  if (user === "usuario") {
    next();
  } else {
    response.redirect("/api/sessions/view");
  }
};

