import { useState } from "react";
import axios from "axios";
import Message from "./message";

function ChatBox() {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "👋 Hello! I'm your AI Product Assistant. Ask me about products like 'Show me books under ₹500' or 'Eco-friendly home décor under ₹1000'.",
      products: [],
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = {
      sender: "user",
      text: input,
      products: [],
    };

    setMessages((prev) => [...prev, userMessage]);

    const userQuery = input;

    setInput("");
    setLoading(true);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/chat",
        {
          message: userQuery,
        }
      );

      const botMessage = {
        sender: "bot",
        text: response.data.message,
        products: response.data.products,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "❌ Sorry! Unable to connect to the server.",
          products: [],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="chat-container">

      <div className="chat-messages">

        {messages.map((message, index) => (
          <Message
            key={index}
            sender={message.sender}
            text={message.text}
            products={message.products}
          />
        ))}

        {loading && (
          <div className="typing">
            🤖 AI is searching products...
          </div>
        )}

      </div>

      <div className="chat-input">

        <input
          type="text"
          placeholder="Ask about any product..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        <button onClick={sendMessage}>
          Send
        </button>

      </div>

    </div>
  );
}

export default ChatBox;