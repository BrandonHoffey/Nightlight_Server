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

  socket.on("message", messageSent);
};
