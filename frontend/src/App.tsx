import React, { useState } from "react";
import { ChatMessage, LangflowResponse } from "./types";

const App: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState("");

  const sendMessage = async () => {
    if (!userInput.trim()) return;

    setMessages((prev) => [...prev, { role: "user", content: userInput }]);

    try {
      const response = await fetch("https://clickrs.co.in/social/run_flow", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userInput }),
      });
      const data: LangflowResponse = await response.json();

      const aiText =
        data.outputs?.[0]?.outputs?.[0]?.messages?.[0]?.message ||
        "No AI response found";

      setMessages((prev) => [...prev, { role: "assistant", content: aiText }]);
    } catch (err) {
      console.error("Error calling backend:", err);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Error: " + (err as Error).message },
      ]);
    }

    setUserInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen font-sans text-gray-100 bg-gray-900">
      {/* Header */}
      <header className="relative flex items-center justify-between p-5 shadow-md bg-gradient-to-r from-gray-800 to-gray-900">
        <h1 className="text-2xl font-bold tracking-wide text-gray-100">
          Techluminix Team - Social Insights
        </h1>
        <div className="text-sm font-semibold text-gray-300">
          Team Members: Bharat Bhandari, Vishal Pandey, Yashraj Verma, Sunny
          Kharwar
        </div>
      </header>

      {/* Messages container */}
      <div className="flex-1 px-4 py-6 space-y-4 overflow-y-auto">
        {messages.map((msg, idx) => {
          const isUser = msg.role === "user";
          return (
            <div
              key={idx}
              className={`flex w-full ${
                isUser ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-3xl p-4 rounded-xl shadow-md whitespace-pre-wrap ${
                  isUser
                    ? "bg-indigo-700 text-white"
                    : "bg-gray-700 text-gray-200"
                }`}
              >
                {msg.content}
              </div>
            </div>
          );
        })}
      </div>

      {/* Input area */}
      <div className="p-4 bg-gray-800 border-t border-gray-700">
        <div className="flex items-center space-x-2">
          <textarea
            className="flex-1 p-3 text-gray-100 bg-gray-700 border border-gray-700 rounded-lg shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400"
            rows={1}
            placeholder="Type your message..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            onClick={sendMessage}
            className="px-5 py-2 text-white transition-opacity rounded-lg shadow-md bg-gradient-to-r from-indigo-600 to-purple-700 hover:opacity-90"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
