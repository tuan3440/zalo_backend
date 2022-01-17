const jwt = require("jsonwebtoken");
const UserModel = require("../models/Users");
const PostModel = require("../models/Posts");
const FriendModel = require("../models/Friends");
const DocumentModel = require("../models/Documents");
var url = require("url");
const httpStatus = require("../utils/httpStatus");
const bcrypt = require("bcrypt");
const { JWT_SECRET } = require("../constants/constants");
const { ROLE_CUSTOMER } = require("../constants/constants");
const uploadFile = require("../functions/uploadFile");

const postsController = {};
// postsController.create = async (req, res, next) => {
//     let userId = req.userId;
//     try {
//         const {
//             described,
//             images,
//             videos,
//         } = req.body;
//         console.log("aaaa", images);

//         let dataImages = [];
//         if (Array.isArray(images)) {
//             for (const image of images) {

//                 if (uploadFile.matchesFileBase64(image) !== false) {
//                     const imageResult = uploadFile.uploadFile(image);
//                     if (imageResult !== false) {
//                         let imageDocument = new DocumentModel({
//                             fileName: imageResult.fileName,
//                             fileSize: imageResult.fileSize,
//                             type: imageResult.type
//                         });
//                         let savedImageDocument = await imageDocument.save();
//                         if (savedImageDocument !== null) {
//                             dataImages.push(savedImageDocument._id);
//                         }
//                     }
//                 }
//             }
//         }

//         let dataVideos = [];
//         if (Array.isArray(videos)) {
//             for (const video of videos) {
//                 if (uploadFile.matchesFileBase64(video) !== false) {
//                     const videoResult = uploadFile.uploadFile(video);
//                     if (videoResult !== false) {
//                         let videoDocument = new DocumentModel({
//                             fileName: videoResult.fileName,
//                             fileSize: videoResult.fileSize,
//                             type: videoResult.type
//                         });
//                         let savedVideoDocument = await videoDocument.save();
//                         if (savedVideoDocument !== null) {
//                             dataVideos.push(savedVideoDocument._id);
//                         }
//                     }
//                 }
//             }
//         }

//         const post = new PostModel({
//             author: userId,
//             described: described,
//             images: dataImages,
//             videos: dataVideos,
//             countComments: 0
//         });
//         let postSaved = (await post.save()).populate('images').populate('videos');
//         postSaved = await PostModel.findById(postSaved._id).populate('images', ['fileName']).populate('videos', ['fileName']).populate({
//             path: 'author',
//             select: '_id username phonenumber avatar',
//             model: 'Users',
//             populate: {
//                 path: 'avatar',
//                 select: '_id fileName',
//                 model: 'Documents',
//             },
//         });
//         return res.status(httpStatus.OK).json({
//             data: postSaved
//         });
//     } catch (e) {
//         return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
//             message: e.message
//         });
//     }
// }

postsController.create = async (req, res, next) => {
  let userId = req.userId;
  try {
    const described = req.body.described;
    let imageFiles = [];
    let videoFiles = [];
    if (req.files.images) {
      imageFiles = req.files.images;
    }
    if (req.files.videos) {
      videoFiles = req.files.videos;
    }
    let images = [];
    let videos = [];
    if (imageFiles) {
      imageFiles.forEach(async (item) => {
        let imageDocument = new DocumentModel({
          fileName: item.filename,
          type: "image"
        });
        let savedDocument = await imageDocument.save();
        if (savedDocument !== null) {
            console.log("aa", savedDocument._id);
          images.push(savedDocument._id);
        }
      });
    }
    if (videoFiles) {
        videoFiles.forEach(async (item) => {
          let videoDocument = new DocumentModel({
            fileName: item.filename,
            type: "video"
          });
          let savedDocument = await videoDocument.save();
          if (savedDocument !== null) {
            videos.push(savedDocument._id);
          }
        });
      }
      setTimeout(async () => {
        console.log("image", images);

        // videoFiles.forEach((item) => {
        //     videos.push('/uploads/videos/' + item.filename);
        // })
        // console.log("aa", images);
        const post = new PostModel({
            author: userId,
            described: described,
            images: images,
            videos: videos,
            countComments: 0
            });
        // console.log("post", post);
        await post.save();
        return res.status(httpStatus.OK).json({
            data: post
        });
      }, 1000)
    
    
  } catch (e) {
    console.log("err", e.message);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: e.message,
    });
  }
};

// postsController.edit = async (req, res, next) => {
//   try {
//     let userId = req.userId;
//     let postId = req.params.id;
//     let postFind = await PostModel.findById(postId);
//     if (postFind == null) {
//       return res
//         .status(httpStatus.NOT_FOUND)
//         .json({ message: "Can not find post" });
//     }
//     if (postFind.author.toString() !== userId) {
//       return res
//         .status(httpStatus.FORBIDDEN)
//         .json({ message: "Can not edit this post" });
//     }

//     const { described, images, videos } = req.body;
//     let dataImages = [];
//     if (Array.isArray(images)) {
//       for (const image of images) {
//         // check is old file
//         if (image) {
//           let imageFile = !image.includes("data:")
//             ? await DocumentModel.findById(image)
//             : null;
//           if (imageFile == null) {
//             if (uploadFile.matchesFileBase64(image) !== false) {
//               const imageResult = uploadFile.uploadFile(image);
//               if (imageResult !== false) {
//                 let imageDocument = new DocumentModel({
//                   fileName: imageResult.fileName,
//                   fileSize: imageResult.fileSize,
//                   type: imageResult.type,
//                 });
//                 let savedImageDocument = await imageDocument.save();
//                 if (savedImageDocument !== null) {
//                   dataImages.push(savedImageDocument._id);
//                 }
//               }
//             }
//           } else {
//             dataImages.push(image);
//           }
//         }
//       }
//     }

//     let dataVideos = [];
//     if (Array.isArray(videos)) {
//       for (const video of videos) {
//         // check is old file
//         if (video) {
//           let videoFile = !video.includes("data:")
//             ? await DocumentModel.findById(video)
//             : null;
//           if (videoFile == null) {
//             if (uploadFile.matchesFileBase64(video) !== false) {
//               const videoResult = uploadFile.uploadFile(video);
//               if (videoResult !== false) {
//                 let videoDocument = new DocumentModel({
//                   fileName: videoResult.fileName,
//                   fileSize: videoResult.fileSize,
//                   type: videoResult.type,
//                 });
//                 let savedVideoDocument = await videoDocument.save();
//                 if (savedVideoDocument !== null) {
//                   dataVideos.push(savedVideoDocument._id);
//                 }
//               }
//             }
//           }
//         }
//       }
//     }

    // let postSaved = await PostModel.findByIdAndUpdate(postId, {
    //   described: described,
    //   images: dataImages,
    //   videos: dataVideos,
    // });
    // postSaved = await PostModel.findById(postSaved._id)
    //   .populate("images", ["fileName"])
    //   .populate("videos", ["fileName"])
    //   .populate({
    //     path: "author",
    //     select: "_id username phonenumber avatar",
    //     model: "Users",
    //     populate: {
    //       path: "avatar",
    //       select: "_id fileName",
    //       model: "Documents",
    //     },
    //   });
    // return res.status(httpStatus.OK).json({
    //   data: postSaved,
    // });
  // } catch (e) {
  //   return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
  //     message: e.message,
  //   });
  // }
// };
postsController.edit = async (req, res, next) => {
  try {
    let userId = req.userId;
    let postId = req.params.id;
    let postFind = await PostModel.findById(postId);

    if (postFind == null) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ message: "Can not find post" });
    }
    if (postFind.author.toString() !== userId) {
      return res
        .status(httpStatus.FORBIDDEN)
        .json({ message: "Can not edit this post" });
    } 
    let imageFiles = [];
    if (req.files.images) {
      imageFiles = req.files.images;

    }
    console.log("oldImage", req.body);

    const { described, oldImage } = req.body;
    // console.log("imageFiles", imageFiles);
    console.log("oldImage", oldImage);
    console.log("post", postFind);
    let images = [];
    if (imageFiles) {
      imageFiles.forEach(async (item) => {
        let imageDocument = new DocumentModel({
          fileName: item.filename,
          type: "image"
        });
        let savedDocument = await imageDocument.save();
        if (savedDocument !== null) {
            console.log("aa", savedDocument._id);
          images.push(savedDocument._id);
        }
      });
    }
    setTimeout(async () => {
      let newImage = [];
      if (!Array.isArray(oldImage)) {
        newImage.push(oldImage);
        newImage = newImage.concat(images);
      } else {
        newImage = oldImage.concat(images)
      }
      console.log("nn", newImage);
      let postSaved = await PostModel.findByIdAndUpdate(postId, {
        described: described,
        images: newImage,
        // videos: dataVideos,
      });
      postSaved = await PostModel.findById(postSaved._id)
        .populate("images", ["fileName"])
        .populate("videos", ["fileName"])
        .populate({
          path: "author",
          select: "_id username phonenumber avatar",
          model: "Users",
          populate: {
            path: "avatar",
            select: "_id fileName",
            model: "Documents",
          },
        });
        return res.status(httpStatus.OK).json({
          data: postSaved,
        });
    }, 1000)
    

  } catch (e) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: e.message,
    });
  }
}

postsController.show = async (req, res, next) => {
  try {
    let post = await PostModel.findById(req.params.id)
      .populate("images", ["fileName"])
      .populate("videos", ["fileName"])
      .populate({
        path: "author",
        select: "_id username phonenumber avatar",
        model: "Users",
        populate: {
          path: "avatar",
          select: "_id fileName",
          model: "Documents",
        },
      });
    if (post == null) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ message: "Can not find post" });
    }
    post.isLike = post.like.includes(req.userId);
    return res.status(httpStatus.OK).json({
      data: post,
    });
  } catch (error) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};
postsController.delete = async (req, res, next) => {
  try {
    let post = await PostModel.findByIdAndDelete(req.params.id);
    if (post == null) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ message: "Can not find post" });
    }
    return res.status(httpStatus.OK).json({
      message: "Delete post done",
    });
  } catch (error) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

postsController.list = async (req, res, next) => {
  try {
    let posts = [];
    let userId = req.userId;
    if (req.query.userId) {
      // get Post of one user
      posts = await PostModel.find({
        author: req.query.userId,
      })
        .populate("images", ["fileName"])
        .populate("videos", ["fileName"])
        .populate({
          path: "author",
          select: "_id username phonenumber avatar",
          model: "Users",
          populate: {
            path: "avatar",
            select: "_id fileName",
            model: "Documents",
          },
        });
    } else {
      // get list friend of 1 user
      let friends = await FriendModel.find({
        status: "1",
      }).or([
        {
          sender: userId,
        },
        {
          receiver: userId,
        },
      ]);
      let listIdFriends = [];
      console.log(friends);
      for (let i = 0; i < friends.length; i++) {
        if (friends[i].sender.toString() === userId.toString()) {
          listIdFriends.push(friends[i].receiver);
        } else {
          listIdFriends.push(friends[i].sender);
        }
      }
      listIdFriends.push(userId);
      console.log(listIdFriends);
      // get post of friends of 1 user
      posts = await PostModel.find({
        author: listIdFriends,
      }).sort({createdAt: -1})
        .populate("images", ["fileName"])
        .populate("videos", ["fileName"])
        .populate({
          path: "author",
          select: "_id username phonenumber avatar",
          model: "Users",
          populate: {
            path: "avatar",
            select: "_id fileName",
            model: "Documents",
          },
        });
    }
    let postWithIsLike = [];
    for (let i = 0; i < posts.length; i++) {
      let postItem = posts[i];
      postItem.isLike = postItem.like.includes(req.userId);
      postWithIsLike.push(postItem);
    }
    return res.status(httpStatus.OK).json({
      data: postWithIsLike,
    });
  } catch (error) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

module.exports = postsController;
