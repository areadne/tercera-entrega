import { Router } from "express";
import { uploadPaymentController, getPaymentsController, getPaymentByEmailController } from "../controllers/payments.controller.js";

const users = []

const router = Router()


router.post('/upload', uploadPaymentController)

router.get('/', getPaymentsController)

router.get('/:email', getPaymentByEmailController)


export default router