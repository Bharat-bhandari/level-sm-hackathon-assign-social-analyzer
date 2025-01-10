import { useState } from "react";
import { ChatMessage, LangflowResponse } from "./types";

const App: React.FC = () => {
  // State for our chat messages
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  // State for the user's input
  const [userInput, setUserInput] = useState("");

  const sendMessage = async () => {
    // Only proceed if there's text
    if (!userInput.trim()) return;

    // 1. Add the user's message to the chat
    setMessages((prev) => [...prev, { role: "user", content: userInput }]);

    try {
      // 2. Call the Flask backend
      const response = await fetch("http://88.198.61.79:5000/run_flow", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userInput }),
      });
      // Parse JSON
      const data: LangflowResponse = await response.json();

      // 3. Extract the AI text from the nested structure
      const aiText =
        data.outputs?.[0]?.outputs?.[0]?.messages?.[0]?.message ||
        "No AI response found";

      // 4. Add the AI’s response to the chat
      setMessages((prev) => [...prev, { role: "assistant", content: aiText }]);
    } catch (err) {
      console.error("Error calling backend:", err);
      // Optionally display an error message
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Error: " + (err as Error).message },
      ]);
    }

    // Clear input
    setUserInput("");
  };

  // Handle "Enter" in the textarea
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent newline
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4">
        <h1 className="text-xl font-bold">Techluminix Chat</h1>
      </header>

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => {
          const isUser = msg.role === "user";
          return (
            <div
              key={idx}
              className={`flex ${isUser ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`rounded-lg p-3 max-w-xl whitespace-pre-wrap ${
                  isUser
                    ? "bg-blue-500 text-white"
                    : "bg-gray-300 text-gray-800"
                }`}
              >
                {msg.content}
              </div>
            </div>
          );
        })}
      </div>

      {/* Input area */}
      <div className="p-4 bg-white border-t border-gray-300">
        <div className="flex items-center">
          <textarea
            className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            rows={1}
            placeholder="Type your message..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            onClick={sendMessage}
            className="ml-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
