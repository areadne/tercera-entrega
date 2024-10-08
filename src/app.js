import express from "express";
import productRouter from "./routers/products.router.js";
import cartRouter from "./routers/carts.router.js";
import mongoose, { mongo } from "mongoose";
import handlebars from "express-handlebars";
import MongoStore from "connect-mongo";
import session from "express-session";
import sessionsRouter from "./routers/sessions.router.js";
import passport from "passport";
import initializePassport from "./config/passport.config.js";
import config from "./config/config.js";
import homeRouter from "./routers/home.router.js";
import { Server } from "socket.io";
import { ProductServiceManager } from "./services/product.service.js";
import viewsRouter from "./routers/chat.router.js";
import messageModel from "./models/messages.model.js";
import mockingRouter from "./routers/mockingproducts.router.js"
import errorMiddleware from "./middlewares/error.middleware.js";
import userRouter from "./routers/user.router.js"
import loggerTest from "./routers/loggertest.router.js"
import paymentsRouter from "./routers/payments.router.js"
import logger from "./helpers/logger.js";
import passwordRouter from "./routers/password.router.js"
import carRouter from "./routers/car.router.js"
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUiExpress from "swagger-ui-express";

const serviceManager = new ProductServiceManager();

const app = express();

app.use(express.json());

app.engine("handlebars", handlebars.engine());
app.set("views", "./src/views");
app.set("view engine", "handlebars");
app.use(express.static("./public"));
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    store: MongoStore.create({
      mongoUrl: config.mongo.url,
      dbName: config.mongo.db_name,
      mongoOptions: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
    }),
    secret: config.mongo.secret,
    resave: true,
    saveUninitialized: true,
  })
);

const swaggerOptions = {
  definition: {
    openapi: "3.0.1",
    info:{
      title: "Documentacion",
      description: "Details"
    }
  },
  apis:["./docs/**/*.yaml"]
}

const specs = swaggerJSDoc(swaggerOptions)
app.use("/apidocs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs))

initializePassport();
app.use(passport.initialize());
app.use(passport.session());

// app.use("/api/cart", cartRouter);
// // app.use("/products", viewRouter);
// // ruta que lleva a login
// app.use("/api/sessions", sessionsRouter);
// app.use("/home", homeRouter);
// app.use("/chat", viewsRouter);
// app.use("/mockingproducts", mockingRouter)
// app.use("/api/products", productRouter);




app.use('/users', userRouter)
app.use("/password", passwordRouter)
app.use('/cars', carRouter)
app.use('/payments', paymentsRouter)




app.use(errorMiddleware)

app.use("/loggerTest", loggerTest)

await mongoose.connect(config.mongo.url_db_name);

const httpServer = app.listen(config.apiserver.port, () => {
  logger.info("estoy en ejecucion");
});


const io = new Server(httpServer);

io.on("connection", (socket) => {
  logger.info("handshake");

  socket.on("formulario", (request) => {
    request.body = request;
    serviceManager.addProductFromSocket(request);
  });

  const promesa = async () => {
    const productosDB = await serviceManager.readProductsDB();
    const productosDBJSON = JSON.stringify(productosDB);
    socket.emit("productos", productosDBJSON);
  };

  promesa();

  socket.on("delete", (data) => {
    const idToDelete = Number(data);
    serviceManager.deleteProductFromSocket(idToDelete);
  });

  socket.on("message", async (data) => {
    logger.info(data);
    messageModel.create({ user: "Persona", message: data });

    try {
      const historial = async () => {
        return await messageModel.find();
      };
      const result = await historial();
      logger.info(result);
      io.emit("historial", result);
    } catch (err) {
      logger.fatal(`Error on socket on creating Persona in database: ${err}`);
    }
  });
});
