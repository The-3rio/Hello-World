// ChatApp.jsx
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import React, { useState } from "react";

const ChatApp = () => {

    const { data: connections } = useQuery({
		queryKey: ["connections"],
		queryFn: () => axiosInstance.get("/connections"),
	});

  const users = [
    { id: 1, name: "John Doe", lastMessage: "Hey! How's it going?", img: "https://via.placeholder.com/40" },
    { id: 2, name: "Alice Smith", lastMessage: "Let’s meet up later.", img: "https://via.placeholder.com/40" },
    { id: 3, name: "David Johnson", lastMessage: "Just sent the documents.", img: "https://via.placeholder.com/40" },
    { id: 4, name: "Emily Brown", lastMessage: "Looking forward to it!", img: "https://via.placeholder.com/40" },
  ];

  const [selectedUser, setSelectedUser] = useState(users[0]);
//   const [messages, setMessages] = useState([
//     { id: 1, text: "Hello!", sender: "me" },
//     { id: 2, text: "Hi, how are you?", sender: "other" },
//     { id: 3, text: "I'm good, thanks!", sender: "me" },
//   ]);
  const [input, setInput] = useState("");

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setMessages([
      { id: 1, text: `Chatting with ${user.name}`, sender: "other" },
    ]);
  };

  const handleSendMessage = () => {
    if (input.trim()) {
      setMessages([...messages, { id: messages.length + 1, text: input, sender: "me" }]);
      setInput("");
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="bg-white w-64 h-full p-4 shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Chats</h2>
        <div className="space-y-4">
          {connections?.data?.map((user) => (
            <div
              key={user.id}
              onClick={() => handleUserClick(user)}
              className={`flex items-center p-2 rounded-lg cursor-pointer ${
                selectedUser.id === user.id ? "bg-blue-100" : "hover:bg-gray-100"
              }`}
            >
              <img src={user.img} alt={user.name} className="w-10 h-10 rounded-full mr-3" />
              <div>
                <h3 className="text-lg font-semibold">{user.name}</h3>
                {/* <p className="text-sm text-gray-500 truncate w-40">{user.lastMessage}</p> */}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col w-full h-full">
        <div className="flex items-center justify-between p-4 bg-blue-600 text-white shadow-md">
          <h2 className="text-xl font-bold">{selectedUser.name}</h2>
        </div>

        <div className="flex flex-col flex-1 p-4 overflow-y-auto space-y-2">
          {/* {messages.map((message) => (
            <div
              key={message.id}
              className={`${
                message.sender === "me" ? "self-end bg-blue-500" : "self-start bg-gray-300"
              } rounded-lg p-2 px-4 text-white max-w-xs`}
            >
              {message.text}
            </div>
          ))} */}
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
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatApp;
