const Message = require("../models/message.model");
const User = require("../models/user.model");
const Group = require("../models/group.model");

module.exports = (io, socket) => {
  const messageSent = async (msg) => {
    const roomName = getRoomName(msg.sender, msg.receiver);
    try {
      const message = new Message({
        sender: msg.sender,
        senderName: msg.senderName,
        senderPicture: msg.senderPicture,
        receiver: msg.receiver,
        receiverName: msg.receiverName,
        receiverPicture: msg.receiverPicture,
        content: msg.content,
      });
      socket.join(roomName);
      const newMessage = await message.save();
      io.to(roomName).emit("message", newMessage);
      console.log(msg);
    } catch (error) {
      console.error(error);
    }
  };

  function getRoomName(senderId, receiverId) {
    return `room_${Math.min(senderId, receiverId)}_${Math.max(
      senderId,
      receiverId
    )}`;
  }

  const updateStatus = async (msg) => {
    try {
      const userId = msg?.user?._id;
      const status = msg?.status;
      const conditions = { _id: userId };
      const updateData = { status };
      const options = { new: true };
      const userStatusUpdate = await User.findOneAndUpdate(
        conditions,
        updateData,
        options
      );
      if (userStatusUpdate) {
        socket.join(userId);
        console.log(userStatusUpdate.status);
        io.to(userId).emit("statusUpdate", userStatusUpdate.status);
      } else {
        console.log("User not found");
        io.to(userId).emit("statusNotFound");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const status = async (user) => {
    try {
      const userId = user.user;
      console.log(userId);
      const userStatus = await User.findById(userId).select("status");
      console.log(userStatus);
      if (userStatus) {
        socket.join(userId);
        io.to(userId).emit("status", userStatus.status);
      } else {
        console.log("User not found");
        io.to(userId).emit("statusNotFound");
      }
    } catch (error) {
      console.error(error);
    }
  };

  // const getMessages = async (user) => {
  //   try {
  //     const receiver = user.receiver;
  //     const sender = user.sender;
  //     const conditions = { $and: [{ sender: sender }, { receiver: receiver }] };
  //     const latestMessage = await Message.find(conditions)
  //       .sort({ created_at: -1 })
  //       .limit(1);
  //     console.log(latestMessage);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  socket.on("status", status);
  socket.on("statusUpdate", updateStatus);
  socket.on("message", messageSent);
};
