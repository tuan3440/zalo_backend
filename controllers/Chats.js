const { PRIVATE_CHAT, GROUP_CHAT } = require("../constants/constants");
const ChatModel = require("../models/Chats");
const MessagesModel = require("../models/Messages");
const httpStatus = require("../utils/httpStatus");
const chatController = {};
chatController.send = async (req, res, next) => {
  try {
    let userId = req.userId;
    const { name, chatId, receivedId, member, type, content } = req.body;
    let chatIdSend = null;
    let chat;
    if (type === PRIVATE_CHAT) {
      if (chatId) {
        chat = await ChatModel.findById(chatId);
        if (chat !== null) {
          chatIdSend = chat._id;
        }
      } else {
        chat = new ChatModel({
          type: PRIVATE_CHAT,
          member: [receivedId, userId],
        });
        await chat.save();
        chatIdSend = chat._id;
      }
    } else if (type === GROUP_CHAT) {
      if (chatId) {
        chat = await ChatModel.findById(chatId);
        if (chat !== null) {
          chatIdSend = chat._id;
        }
      } else {
        chat = new ChatModel({
          type: GROUP_CHAT,
          member: member,
        });
        await chat.save();
        chatIdSend = chat._id;
      }
    }
    if (chatIdSend) {
      if (content) {
        let message = new MessagesModel({
          chat: chatIdSend,
          user: userId,
          content: content,
        });
        await message.save();
        let messageNew = await MessagesModel.findById(message._id)
          .populate("chat")
          .populate("user");
        return res.status(httpStatus.OK).json({
          data: messageNew,
        });
      } else {
        return res.status(httpStatus.OK).json({
          data: chat,
          message: "Create chat success",
          response: "CREATE_CHAT_SUCCESS",
        });
      }
    } else {
      return res.status(httpStatus.BAD_REQUEST).json({
        message: "Not chat",
      });
    }
  } catch (e) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: e.message,
    });
  }
};

chatController.getMessages = async (req, res, next) => {
  try {
    let messages = await MessagesModel.find({
      chat: req.params.chatId,
    }).populate({
      path: "user",
      select: "_id username avatar",
      model: "Users",
      populate: {
        path: "avatar",
        select: "_id fileName",
        model: "Documents",
      },
    });
    return res.status(httpStatus.OK).json({
      data: messages,
    });
  } catch (e) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: e.message,
    });
  }
};

chatController.createChat = async (req, res, next) => {
  try {
    let userId = req.userId;
    let friendId = req.params.friendId;
    let chatList = await ChatModel.find();
    let chatExist = false;
    let chatIdSend = null;
    if (chatList) {
      chatList.map((chat) => {
        if (chat.member.includes(userId) && chat.member.includes(friendId)) {
          chatExist = true;
          chatIdSend = chat._id;
        }
      });
    }
    if (!chatExist) {
      let chat = new ChatModel({
        type: PRIVATE_CHAT,
        member: [friendId, userId],
      });
      await chat.save();
      chatIdSend = chat._id;
    }

    return res.status(httpStatus.OK).json({
      data: chatIdSend,
    });
  } catch (e) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: e.message,
    });
  }
};

chatController.getListChat = async (req, res, next) => {
  try {
    let userId = req.userId;
    let chats = await ChatModel.find({}).populate({
      path: "member",
      select: "_id username avatar blocked_inbox",
      model: "Users",
      populate: {
        path: "avatar",
        select: "_id fileName",
        model: "Documents",
      },
    });
    console.log("chats", chats);
    let chatlist = chats.filter((chat) => {
      if (chat.member[1]._id == userId || chat.member[0]._id == userId) {
        return chat;
      }
    });
    console.log("list", chatlist);
    return res.status(httpStatus.OK).json({
      data: chatlist,
    });
  } catch (e) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: e.message,
    });
  }
};

module.exports = chatController;
