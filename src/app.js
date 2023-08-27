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

initializePassport();
app.use(passport.initialize());
app.use(passport.session());

app.use("/api/products", productRouter);
app.use("/api/cart", cartRouter);
// app.use("/products", viewRouter);
// ruta que lleva a login
app.use("/api/sessions", sessionsRouter);
app.use("/home", homeRouter);
app.use("/chat", viewsRouter);

await mongoose.connect(config.mongo.url_db_name);

const httpServer = app.listen(config.apiserver.port, () => {
  console.log("estoy en ejecucion");
});

const io = new Server(httpServer);
//}}}
// const messages = [];

io.on("connection", (socket) => {
  console.log("handshake");

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

  //chat del profe
  // socket.broadcast.emit('alerta')
  // socket.emit('logs', messages)
  // socket.on('message', data => {
  //     messages.push(data)
  //     io.emit('logs', messages)
  // })
  socket.on("message", async (data) => {
    console.log(data);
    messageModel.create({ user: "Persona", message: data });

    try {
      const historial = async () => {
        return await messageModel.find();
      };
      const result = await historial();
      console.log(result);
      io.emit("historial", result);
    } catch (err) {
      console.log(err);
    }
  });
});

// const messages = []

// io.on('connection', socket => {
//     socket.broadcast.emit('alerta')
//     socket.emit('logs', messages)
//     socket.on('message', data => {
//         messages.push(data)
//         io.emit('logs', messages)
//     })
// })
