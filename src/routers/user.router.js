import { Router } from "express";
import { validateTokenController, loginTokenController, createUserController, getUserController, getUserByIdController, changeUserController, deleteUser } from "../controllers/users.controller.js";
import { authenticateToken } from "../middlewares/jwtvalidate.middleware.js"

const users = []

const router = Router()

router.post('/create', createUserController)

router.post('/login', loginTokenController)

router.get('/', getUserController)

router.get('/:email', getUserByIdController)

router.get('/validatetoken', authenticateToken, validateTokenController)

router.delete('/', authenticateToken, deleteUser)

export default router