import React, { useState } from "react";
import { Button, Input, Spin, message } from "antd";
import { SendOutlined, RobotOutlined, CloseOutlined } from "@ant-design/icons";
import "./ChatWidget.css";
import axios from "axios";

const ChatWidget = () => {
  const [visible, setVisible] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setChatHistory([...chatHistory, { role: "user", content: userMsg }]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:8000/chat", { message: userMsg });
      setChatHistory((prev) => [...prev, { role: "bot", content: res.data.response }]);
    } catch (e) {
      console.error("❌ Chat error:", e);
      setChatHistory((prev) => [...prev, { role: "bot", content: "❌ Sorry, something went wrong." }]);
      message.error("Chat API error");
    }
    setLoading(false);
  };

  return (
    <>
      {/* Floating Chat Icon */}
      <div className="chat-fab" onClick={() => setVisible(!visible)}>
        {visible ? <CloseOutlined /> : <RobotOutlined />}
      </div>

      {/* Chat Popup */}
      {visible && (
        <div className="chat-popup">
          <div className="chat-header">🤖 Ask DataPulse AI</div>
          <div className="chat-body">
            {chatHistory.map((msg, i) => (
              <div key={i} className={`chat-msg ${msg.role}`}>
                <strong>{msg.role === "user" ? "You" : "Bot"}:</strong> {msg.content}
              </div>
            ))}
            {loading && <Spin size="small" />}
          </div>
          <div className="chat-footer">
            <Input
              placeholder="Type your question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onPressEnter={handleSend}
              suffix={<SendOutlined onClick={handleSend} />}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ChatWidget;
