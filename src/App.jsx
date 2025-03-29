import React, { useEffect, useState, useRef } from "react";

const ws = new WebSocket("ws://localhost:8080"); // Замените на ваш WebSocket-сервер

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const chatRef = useRef(null);

  useEffect(() => {
    ws.onmessage = (event) => {
      setMessages((prev) => [...prev, { text: event.data, sender: "other" }]);
    };
  }, []);

  useEffect(() => {
    chatRef.current?.scrollTo(0, chatRef.current.scrollHeight);
  }, [messages]);

  const sendMessage = () => {
    if (input.trim()) {
      ws.send(input);
      setMessages((prev) => [...prev, { text: input, sender: "me" }]);
      setInput("");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-4">
        <h2 className="text-xl font-bold mb-2">WebSocket Chat</h2>
        <div ref={chatRef} className="chat-container border p-2 rounded-lg bg-gray-50">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`message p-2 rounded-lg max-w-[70%] ${
                msg.sender === "me" ? "sent self-end" : "received"
              }`}
            >
              {msg.text}
            </div>
          ))}
        </div>
        <div className="mt-4 flex">
          <input
            className="flex-1 border rounded-lg p-2"
            placeholder="Введите сообщение..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-lg"
            onClick={sendMessage}
          >
            Отправить
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
