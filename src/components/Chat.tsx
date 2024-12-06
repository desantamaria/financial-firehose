"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";

export interface Message {
  role: "system" | "user";
  content: string;
}

export default function Chat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setInput("");
    const newUserMessage = {
      role: "user",
      content: input,
    } as Message;
    const newMessage = [...messages, newUserMessage];
    setMessages(newMessage);

    fetch(`/api/py/perform_rag/${input}`)
      .then((res) => res.json())
      .then((data) => {
        setMessages([...newMessage, data]);
        console.log(data);

        setIsLoading(false);
      });
  };

  const handleClick = async () => {
    fetch(`/api/py/perform_scrape`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);

        // setIsLoading(false);
      });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex-1 relative">
      <Button
        onClick={handleClick}
        variant="outline"
        className="absolute top-0 right-0 m-4"
      >
        Scrape News Articles
      </Button>
      <div className="mx-auto max-w-2xl h-screen">
        <div className="h-[calc[100vh-180px] overflow-y-auto space-y-4 p-4 pb-40">
          {messages.length > 0 &&
            messages.map((message, index) => (
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
          className="fixed bottom-0 w-[calc(100%-var(--sidebar-width))] max-w-2xl bg-white px-4 pb-16 z-10 flex gap-2 items-center"
        >
          <input
            disabled={isLoading ? true : false}
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
