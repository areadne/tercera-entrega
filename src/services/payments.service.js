import PaymentsDAO from "../dao/payments.mongo.dao.js";
import paymentsRepository from "../repositories/payments.repository.js";
import userModel from "../models/user.model.js";

export const PaymentsService = new paymentsRepository(new PaymentsDAO());

export class paymentServiceManager {
    constructor() { }

    uploadPayment = async (request, response) => {

        console.log(request.body)

        const { purchaser_email, issuing_bank, issuing_phone_number, reference_number, purchase_datetime, amount, img } = request.body;

        let validateEmail = await userModel.findOne({ email: purchaser_email });

        if (validateEmail) {

            const newPayment = await PaymentsService.create({
                purchaser_email,
                issuing_bank,
                issuing_phone_number,
                reference_number,
                purchase_datetime,
                amount,
                img
            });
            response.send({ "status": "Payment received successfully", payload: newPayment })

        } else {

            console.log("user email does not exits on DB");
            response.status(400).send({ "status": "something went wrong", payload: "user email does not exits on DB" })

        }
    }


    getPayment = async (request, response) => {

        let payments = await PaymentsService.getAll();
        console.log(payments)

        response.send({ "status": "success", payload: payments })

    }

    getPaymentByEmail = async (request, response) => {

        const email = request.params.email

        let payments = await PaymentsService.getOne({ purchaser_email: email });
        console.log(payments)

        response.send({ "status": "success", payload: payments })

    }
}
