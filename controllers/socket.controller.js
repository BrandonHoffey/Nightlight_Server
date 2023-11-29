const Message = require("../models/message.model");
const User = require("../models/user.model");
const Group = require("../models/group.model");

module.exports = (io, socket) => {
  const messageSent = async (msg) => {
    const roomName = getRoomName(msg.sender, msg.receiver);
    try {
      const isGroup = await Group.findById(msg.receiver);
      const isUser = await User.findById(msg.receiver);

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
      if (isGroup) {
        const group = isGroup;
        const isSenderInGroup = group.users.some(
          (user) => user._id === msg.sender
        );
        if (isSenderInGroup) {
          io.to(roomName).emit("groupMessage", newMessage);
        } else {
          console.log("Sender is not a member of the group");
        }
      }

      if (isUser) {
        io.to(roomName).emit("message", newMessage);
      }
      console.log(msg);
    } catch (error) {
      console.error(error);
    }
  };

  function getRoomName(senderId, receiverId) {
    return `user_${Math.min(senderId, receiverId)}_${Math.max(
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

  const inboxUpdate = async (user) => {
    try {
      const userId = user.user._id;
      const conditions = { users: { $elemMatch: { _id: userId } } };
      const userFriends = await User.findById(userId).populate(
        "friends",
        "_id username displayName profilePicture status"
      );
      const userGroups = await Group.find(conditions).select(
        "_id name groupPicture users"
      );
      console.log(userGroups);
      if (userFriends || userGroups) {
        const data = [];
        userFriends?.friends?.forEach((friend) => data.push(friend));
        userGroups?.forEach((group) => data.push(group));
        console.log(data);
        socket.join(userId);
        io.to(userId).emit("inboxUpdate", data);
      } else {
        console.log("User not found");
        io.to(userId).emit("userNotFound");
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

  socket.on("message", messageSent);
  socket.on("status", status);
  socket.on("statusUpdate", updateStatus);
  socket.on("inboxUpdate", inboxUpdate);
};
