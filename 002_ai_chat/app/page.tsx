"use client";
import { Setting } from "@prisma/client";
import axios from "axios";
import { ChatRequest, ChatResponse, ModelResponse } from "ollama";
import { useEffect, useState } from "react";
import { MdSend } from "react-icons/md";
import { PulseLoader } from "react-spinners";
import Markdown from "react-markdown";

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [models, setModels] = useState<ModelResponse[]>([]);
  const [currentModel, setCurrentModel] = useState("");
  const [options, setOptions] = useState<Setting[]>([]);
  const [currentChat, setCurrentChat] = useState<ChatRequest>({
    model: currentModel,
    messages: [],
  });

  useEffect(() => {
    if (loading) {
      const sendMessage = async () => {
        currentChat.model = currentModel;
        setCurrentMessage("");
        currentChat.messages?.push({ role: "user", content: currentMessage });
        const response = await axios.post("/api/chat", currentChat);
        const data: ChatResponse = response.data;
        currentChat.messages?.push(data.message);
        setCurrentChat(currentChat);
        setLoading(false);
      };
      sendMessage();
    }
  }, [loading]);

  useEffect(() => {
    const getModels = async () => {
      const response = await axios.get("/api/models");
      setModels(response.data);
    };
    const getOptions = async () => {
      const response = await axios.get("/api/setting");
      setOptions(response.data);
    };
    getModels();
    getOptions();

    return () => {};
  }, []);

  useEffect(() => {
    const modelQuery = options.find((option) => option.key === "model");
    if (modelQuery) {
      setCurrentModel(modelQuery.value);
    }
  }, [options]);

  useEffect(() => {
    if (currentModel) {
      axios.post("/api/setting", [{ key: "model", value: currentModel }]);
    }
  }, [currentModel]);

  return (
    <div className="h-full w-full flex flex-col justify-end gap-4 pb-4">
      {/* The models dropdown */}
      <div className="p-3">
        <select
          name="model"
          id="model"
          value={currentModel}
          onChange={(e) => setCurrentModel(e.target.value)}
        >
          <option value="" disabled>
            Select a model
          </option>
          {models.map((model, index) => (
            <option value={model.name} key={index}>
              {model.name}
            </option>
          ))}
        </select>
      </div>
      <div className="flex-grow overflow-y-auto">
        {currentChat.messages?.map((message, index) =>
          message.role === "user" ? (
            <div key={index} className="flex justify-end">
              <div className="w-3/4 flex justify-end">
                <div className="bg-gray-500 text-white p-2 rounded-l w-auto rounded-tr">
                  <Markdown>{message.content}</Markdown>
                </div>
              </div>
            </div>
          ) : (
            message.role === "assistant" && (
              <div key={index} className="flex justify-start">
                <div className="w-3/4 flex">
                  <div className="bg-orange-500 text-white w-auto p-2 rounded-r rounded-tl">
                    <Markdown>{message.content}</Markdown>
                  </div>
                  <div></div>
                </div>
              </div>
            )
          )
        )}
      </div>
      <PulseLoader color="#FF8200" loading={loading} size={20} />
      <div className="h-32 flex gap-3 justify-center flex-shrink-0">
        <textarea
          className="w-full p-2 border border-gray-300 rounded"
          placeholder="Ask me anything!"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              setLoading(true);
            }
          }}
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
        />
        <MdSend
          className="h-full text-4xl text-orange-400 hover:text-orange-500 cursor-pointer"
          onClick={(e) => setLoading(true)}
        />
      </div>
    </div>
  );
}
