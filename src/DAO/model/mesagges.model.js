import mongoose from "mongoose";

const messageCollection = "messages";

const messageSchema = new mongoose.Schema({
    messages: {
        type: [
            {
                email: String,
                message: String
            }
        ],
        default: []
    }
});

const messageModel = mongoose.model(messageCollection, messageSchema);

export default messageModel