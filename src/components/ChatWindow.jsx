import { useState, useEffect, useRef } from "react";
import Message from "./Message";

const WS_URL = "ws://localhost:7153"; // Замените на реальный WebSocket сервер

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const ws = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    ws.current = new WebSocket(WS_URL);

    ws.current.onopen = () => console.log("Connected to WebSocket");

    ws.current.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.type === "history") {
        setMessages(msg.data);
      } else if (msg.type === "message") {
        setMessages((prev) => [...prev, { data: msg.data, self: false }]);
      }
    };

    return () => ws.current.close();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (input.trim() === "") return;
    const messageObj = { type: "message", data: input };

    ws.current.send(JSON.stringify(messageObj));
    setMessages((prev) => [...prev, { data: input, self: true }]);
    setInput("");
  };

  return (
    <div className="w-full max-w-md bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="p-4 border-b bg-gray-200">
        <h2 className="text-xl font-bold text-gray-700">WebSocket Chat</h2>
      </div>

      <div className="h-96 overflow-y-auto p-4 space-y-2">
        {messages.map((msg, index) => (
          <Message key={index} text={msg.data} self={msg.self} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Введите сообщение..."
          className="flex-1 p-2 border rounded-lg outline-none"
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Отправить
        </button>
      </div>
    </div>
  );
}