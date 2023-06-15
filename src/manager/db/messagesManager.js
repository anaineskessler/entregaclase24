import messageModel from "../../model/mesagges.model.js";

class MessagesManager {
    constructor() {
        this.id = "null";
    }

    setID = async (data) => {
        this.id = await data;
        return this.id;
    }
    getID = () => {
        let data = this.id;
        return data;
    }

}

const chatManager = new MessagesManager();

export default chatManager;