const friendController = require("../controllers/Friends");
const {asyncWrapper} = require("../utils/asyncWrapper");
const express = require("express");
const friendsRoutes = express.Router();
const ValidationMiddleware = require("../middlewares/validate");
const auth = require("../middlewares/auth");

friendsRoutes.post("/set-request-friend", auth, friendController.setRequest);
friendsRoutes.get("/get-requested-friend", auth, friendController.getRequest);
friendsRoutes.get("/get-requested-friend-user-send", auth, friendController.getRequested);
friendsRoutes.post("/set-accept", auth, friendController.setAccept);
friendsRoutes.post("/set-remove", auth, friendController.setRemoveFriend);
friendsRoutes.get("/list", auth, friendController.listFriends);

module.exports = friendsRoutes;