import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import Cookies from 'js-cookie';

const ChatPage = () => {
  const { username } = useParams();
  const { data: authUser } = useQuery({
    queryKey: ["authUser"],
    queryFn: () => axiosInstance.get("/auth/user"), // Assuming there's an endpoint to get the authenticated user
  });

  const { data: connections } = useQuery({
    queryKey: ["connections"],
    queryFn: () => axiosInstance.get("/connections"),
  });

  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  // Fetch messages when a user is selected
  useEffect(() => {
    if (selectedUser) {
      fetchMessages(authUser._id, selectedUser._id);
    }
  }, [selectedUser, authUser]);

  const fetchMessages = async (userId, otherUserId) => {
    
    try {
      // Updated fetch call to match the backend route '/api/v1/chats/:id'
      const response = await fetch(`http://localhost:8000/api/v1/chats/send/${userId}/${otherUserId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("jwt-linkedin")}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch messages");
      }
      const data = await response.json();
      console.log(data)
      setMessages(data.messages);
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  };

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setMessages([]); // Clear messages when a new user is selected
  };

  const sendMessage = async (senderId, receiverId, content) => {
    try {
      const response = await fetch(`http://localhost:8000/api/v1/chats/send/${senderId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("jwt-linkedin")}`,
        },
        body: JSON.stringify({ senderId, receiverId, content }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error sending message");
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error("Error sending message:", error.message);
    }
  };

  const handleSendMessage = async () => {
    if (input.trim() && selectedUser) {
      const message = await sendMessage(authUser._id, selectedUser._id, input);
      if (message) {
        setMessages([...messages, { id: message._id, text: message.content, sender: authUser._id }]);
      }
      setInput(""); // Clear input after sending
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="bg-white w-64 h-full p-4 shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Chats</h2>
        <div className="space-y-4">
          {connections?.data?.map((user) => (
            <div
              key={user._id}
              onClick={() => handleUserClick(user)}
              className={`flex items-center p-2 rounded-lg cursor-pointer ${
                selectedUser?.id === user.id ? "bg-blue-100" : "hover:bg-gray-100"
              }`}
            >
              <img src={user.img} alt={user.name} className="w-10 h-10 rounded-full mr-3" />
              <div>
                <h3 className="text-lg font-semibold">{user.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex flex-col w-full h-full">
        <div className="flex items-center justify-between p-4 bg-blue-600 text-white shadow-md">
          <h2 className="text-xl font-bold">{selectedUser ? selectedUser.name : "Select a User"}</h2>
        </div>

        <div className="flex flex-col flex-1 p-4 overflow-y-auto space-y-2">
          {messages.map((message) => (
            <div
              key={message._id}
              className={`${
                message.senderId === authUser._id ? "self-end bg-blue-500" : "self-start bg-gray-300"
              } rounded-lg p-2 px-4 text-white max-w-xs`}
            >
              {message.content}
            </div>
          ))}
        </div>

        <div className="flex items-center p-4 bg-gray-200">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 p-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={handleSendMessage}
            className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            disabled={!selectedUser}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
