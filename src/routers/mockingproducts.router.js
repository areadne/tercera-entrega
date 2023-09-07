import { Router } from "express";
import { faker } from "@faker-js/faker";
import productsMockingModel from "../models/mocking.model.js";

const router = Router();

router.get("/", async (request, response) => {
  let products = [];
  let productsMocking;
  let internal_id;

  for (let i = 1; i < 100; i++) {
    internal_id = i;
    
    productsMocking = {
      internal_id: internal_id,
      title: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: Number(faker.commerce.price({ min: 5000, max: 60000, dec: 0 })),
      thumbnail: faker.internet.url(),
      code: internal_id,
      stock: Number(faker.finance.amount({ min: 5, max: 150, dec: 0 })),
      category: faker.commerce.department(),
      status: faker.datatype.boolean({ probability: 0.4 }),
    };

    productsMockingModel.create(productsMocking);
    products.push(productsMocking);
  }

  response.send(products);
});

export default router;
