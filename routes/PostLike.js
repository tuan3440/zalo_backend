const postLikeController = require("../controllers/PostLike");
const {asyncWrapper} = require("../utils/asyncWrapper");
const express = require("express");
const postLikeRoutes = express.Router();
const auth = require("../middlewares/auth");

postLikeRoutes.get(
    "/action/:postId",
    auth,
    asyncWrapper(postLikeController.action),
);

module.exports = postLikeRoutes;