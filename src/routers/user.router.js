import { Router } from "express";
import { changeUserController, getUsersController, deleteUser } from "../controllers/users.controller.js";

const users = []

const router = Router()

router.post('/premium/:uid', changeUserController)

router.get('/', getUsersController)

router.delete('/', deleteUser)

export default router