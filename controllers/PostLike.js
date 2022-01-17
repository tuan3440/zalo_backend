const httpStatus = require("../utils/httpStatus");
const PostModel = require("../models/Posts");

const postLikeController = {};

postLikeController.action = async (req, res, next) => {
    try {
        console.log("tuandz");
        let userId = req.userId;
        let post = await PostModel.findById(req.params.postId);
        if (post == null) {
            return res.status(httpStatus.NOT_FOUND).json({message: "Can not find post"});
        }

        let arrLike = post.like;
        let arrLikeNotContainCurrentUser = arrLike.filter((item) => {
            return item != userId
        });
        if (arrLikeNotContainCurrentUser.length === arrLike.length) {
            arrLike.push(userId);
        } else {
            arrLike = arrLikeNotContainCurrentUser;
        }
        post = await PostModel.findOneAndUpdate({_id: req.params.postId}, {
            like: arrLike
        }, {
            new: true,
            runValidators: true
        }).populate('like', ['_id']);

        if (!post) {
            return res.status(httpStatus.NOT_FOUND).json({message: "Can not find post"});
        }
        let t = 0;
        post.like.map(item => {
            if (item._id == req.userId) {
                t = 1;
            }
        })
        // post.isLike = t ? true : false;
        post = await PostModel.findOneAndUpdate({_id: req.params.postId}, {
            isLike: t ? true : false
        });
        console.log("cc", post)
        return res.status(httpStatus.OK).json({
            data: post
        });
    } catch (error) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({message: error.message});
    }
}

module.exports = postLikeController;