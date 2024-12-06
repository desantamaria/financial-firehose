"use client";

import { useEffect, useRef, useState } from "react";
import { mockMessages } from "@/app/mockMessages";

export default function Chat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState(mockMessages);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    fetch("/api/py/helloFastApi")
      .then((res) => res.json())
      .then((data) => {
        // setMessages(data);
        console.log(data);
      });

    // result = await fetch('api/')
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex-1 relative">
      <div className="mx-auto max-w-2xl h-screen">
        <div className="h-[calc[100vh-180px] overflow-y-auto space-y-4 p-4 pb-40">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`rounded-lg px-4 py-2 ${message.role === "user" ? "bg-blue-200" : "bg-gray-200"}`}
              >
                {message.content}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="fixed bottom-[76px] w-[calc(100%-var(--sidebar-width))] h-24 bg-grandient-to-t from-white via-white/100 to-transparent pointer-events-none max-w-2xl mx-auto" />
        <form
          onSubmit={handleSubmit}
          className="fixed bottom-0 w-[calc(100%-var(--sidebar-width))] max-w-2xl bg-white px-4 pb-16 z-10"
        >
          <input
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              console.log(input);
            }}
            placeholder="Say something..."
            className="w-full rounded-lg border border-gray-300 p-4"
          />
        </form>
      </div>
    </div>
  );
}
