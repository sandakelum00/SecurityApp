const Message = require("../Models/Message.js");
const User = require("../Models/User.js");
const {
  encryptMessage,
  decryptMessage,
} = require("../Utils/MessageManager.js");

const insertMessage = async (req, res, next) => {
  try {
    const { message } = req.body;

    const user = await User.findById(req.user.userId);

    if (user.role === "Workers" || user.role === "Managers") {
      if (!message) {
        res.status(400).json({ message: "Please provide all values" });
        throw new Error("Please provide all values");
      }

      const msgDetails = new Message({
        message: encryptMessage(message).encryptedData,
        iv: encryptMessage(message).base64data,
        createdBy: req.user.userId,
      });

      const msg = await msgDetails.save();

      res.status(201).json({ msg });
    } else {
      res.status(401).json({
        message: "Invalid You do not have the authorization to access this.",
      });
      throw new Error("You do not have the authorization to access this.");
    }
  } catch (error) {
    throw new Error(error);
  }
};

const getAllMessages = async (req, res, next) => {
  const user = await User.findById(req.user.userId);

  if (user.role === "Admin") {
    let msg = await Message.find().populate({
      path: "createdBy",
      select: "userName",
    });

    let msgArr = [];

    for (let i = 0; i < msg.length; i++) {
      msgArr.push({
        userId: msg[i].createdBy._id,
        userName: msg[i].createdBy.userName,
        message: decryptMessage(msg[i].iv, msg[i].message),
        time: msg[i].createdAt,
      });
    }

    res.status(200).json({ msg: msgArr });
  } else {
    res.status(401).json({
      message: "Invalid You do not have the authorization to access this.",
    });
    throw new Error("You do not have the authorization to access this.");
  }
};

module.exports = { insertMessage, getAllMessages };
