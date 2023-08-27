import mongoose, { mongo } from "mongoose";

const messagesCollection = 'messages'

const messagesShema = mongoose.Schema({
    user: { type: String },
    message: { type: String}
})

const messageModel = mongoose.model(messagesCollection, messagesShema)

export default messageModel