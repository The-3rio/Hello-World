import Message from "../models/chat.model.js";

export const send = async (req, res) => {
  try {
    const { senderId, receiverId, content } = req.body;
    const message = new Message({ senderId, receiverId, content });
    await message.save();
    res.status(201).json({ message: "Message sent successfully", data: message });
  } catch (error) {
    res.status(500).json({ error: "Error sending message" });
  }
};

export const Messages = async (req, res) => {
  try {
    const { userId, otherUserId } = req.params;
    const messages = await Message.find({
      $or: [
        { senderId: userId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: userId },
      ],
    }).sort("timestamp");
    res.status(200).json({ messages });
  } catch (error) {
    res.status(500).json({ error: "Error retrieving messages" });
  }
};

export const MarkMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const message = await Message.findByIdAndUpdate(
      messageId,
      { read: true },
      { new: true }
    );
    if (message) {
      res.status(200).json({ message: "Message marked as read", data: message });
    } else {
      res.status(404).json({ error: "Message not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error updating message status" });
  }
};
