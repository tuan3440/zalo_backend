const chatController = require("../controllers/Chats");
const {asyncWrapper} = require("../utils/asyncWrapper");
const express = require("express");
const chatsRoutes = express.Router();
const auth = require("../middlewares/auth");

chatsRoutes.post(
    "/send",
    auth,
    asyncWrapper(chatController.send),
);

chatsRoutes.get(
    "/getMessages/:chatId",
    auth,
    asyncWrapper(chatController.getMessages),
);

chatsRoutes.get(
    "/createChat/:friendId",
    auth,
    asyncWrapper(chatController.createChat),
);

chatsRoutes.get(
    "/getListChat",
    auth,
    asyncWrapper(chatController.getListChat),
);




module.exports = chatsRoutes;