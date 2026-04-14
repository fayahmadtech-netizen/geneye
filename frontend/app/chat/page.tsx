"use client";

import { useEffect, useState, useRef } from "react";
import { ChatSession, ChatMessage } from "../types/chat";
import { chatService } from "../services/chatService";
import { useAuth } from "../hooks/useAuth";
import {
  MessageSquare,
  Plus,
  Send,
  Loader2,
  Cpu,
  User as UserIcon,
} from "lucide-react";

export default function ChatPage() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load Sessions natively
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const data = await chatService.getSessions();
        setSessions(data);
        if (data.length > 0) {
          setActiveSessionId(data[0].id);
        }
      } catch (err) {
        console.error("Failed to load chat sessions", err);
      }
    };
    fetchSessions();
  }, []);

  // Load messages when active session changes
  useEffect(() => {
    if (!activeSessionId) return;

    const fetchMessages = async () => {
      try {
        setIsLoadingHistory(true);
        const data = await chatService.getMessages(activeSessionId);
        setMessages(data);
      } catch (err) {
        console.error("Failed to load messages", err);
      } finally {
        setIsLoadingHistory(false);
      }
    };
    fetchMessages();
  }, [activeSessionId]);

  // Auto-scroll Down
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleNewSession = async () => {
    try {
      const title = `Chat Configuration ${sessions.length + 1}`;
      const newSession = await chatService.createSession({ title });
      setSessions([newSession, ...sessions]);
      setActiveSessionId(newSession.id);
    } catch (err) {
      console.error("Failed to start new session", err);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !activeSessionId || isSending) return;

    const currentText = inputValue;
    setInputValue("");
    setIsSending(true);

    // Optimistically update UI
    const tempMessage: ChatMessage = {
      id: "temp-msg",
      session_id: activeSessionId,
      role: "user",
      content: currentText,
      created_at: new Date().toISOString(),
    };
    setMessages(prev => [...prev, tempMessage]);

    try {
      // The backend returns the full updated list of messages including AI's reply
      const updatedMessages = await chatService.sendMessage(activeSessionId, { content: currentText });
      setMessages(updatedMessages);
    } catch (err) {
      console.error("Failed to send message", err);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="h-[calc(100vh-[6rem])] flex flex-col md:flex-row gap-6">
      
      {/* 1. Left Sidebar - Chat Sessions */}
      <div className="w-full md:w-72 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm flex flex-col flex-shrink-0 transition-colors">
        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
          <button
            onClick={handleNewSession}
            className="w-full flex items-center justify-center py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-sm"
          >
            <Plus className="h-5 w-5 mr-2" />
            New Chat
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {sessions.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-6">No active sessions.</p>
          ) : (
            sessions.map(session => (
              <button
                key={session.id}
                onClick={() => setActiveSessionId(session.id)}
                className={`w-full flex items-center p-3 rounded-lg text-left transition-colors ${
                  activeSessionId === session.id
                    ? "bg-blue-50 dark:bg-blue-900/40 border border-blue-200 dark:border-blue-800"
                    : "hover:bg-gray-50 dark:hover:bg-gray-800 border border-transparent"
                }`}
              >
                <MessageSquare className={`h-5 w-5 mr-3 shrink-0 ${
                  activeSessionId === session.id ? "text-blue-600 dark:text-blue-400" : "text-gray-400"
                }`} />
                <div className="truncate">
                  <span className={`text-sm font-medium block truncate ${
                    activeSessionId === session.id ? "text-blue-900 dark:text-blue-100" : "text-gray-700 dark:text-gray-200"
                  }`}>
                    {session.title}
                  </span>
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    {new Date(session.updated_at).toLocaleDateString()}
                  </span>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* 2. Main Chat Area */}
      <div className="flex-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm flex flex-col overflow-hidden transition-colors">
        
        {/* Header */}
        <div className="h-16 border-b border-gray-200 dark:border-gray-800 flex items-center px-6 shrink-0 bg-gray-50 dark:bg-gray-900/50">
           <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
             <Cpu className="h-5 w-5 mr-2 text-indigo-500" />
             Industrial Copilot
           </h2>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/50 dark:bg-gray-950/20">
          {isLoadingHistory ? (
            <div className="flex justify-center py-6">
              <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-4">
              <Cpu className="h-16 w-16 opacity-30" />
              <p>Type a message below to start interacting with the GenAI platform.</p>
            </div>
          ) : (
            messages.map((msg, idx) => {
              const isUser = msg.role === "user";
              return (
                <div key={idx} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                  
                  {/* Assistant Avatar */}
                  {!isUser && (
                    <div className="h-8 w-8 rounded bg-indigo-100 dark:bg-indigo-900/50 flex flex-shrink-0 items-center justify-center mr-3 mt-1 border border-indigo-200 dark:border-indigo-800">
                      <Cpu className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                  )}

                  {/* Message Bubble */}
                  <div className={`max-w-[80%] rounded-xl px-5 py-3.5 shadow-sm text-sm leading-relaxed
                    ${isUser 
                      ? "bg-blue-600 text-white rounded-br-none" 
                      : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 rounded-bl-none"
                    }
                  `}>
                    {msg.content}
                  </div>

                  {/* User Avatar */}
                  {isUser && (
                    <div className="h-8 w-8 rounded bg-blue-100 dark:bg-blue-900/50 flex flex-shrink-0 items-center justify-center ml-3 mt-1 border border-blue-200 dark:border-blue-800">
                      <UserIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                  )}

                </div>
              );
            })
          )}
          {isSending && (
            <div className="flex justify-start">
               <div className="h-8 w-8 rounded bg-indigo-100 dark:bg-indigo-900/50 flex flex-shrink-0 items-center justify-center mr-3 mt-1 border border-indigo-200 dark:border-indigo-800">
                 <Cpu className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
               </div>
               <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl rounded-bl-none px-5 py-4 flex items-center space-x-2 shadow-sm">
                 <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                 <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                 <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
               </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shrink-0">
          <form onSubmit={handleSendMessage} className="relative flex items-center">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask the AI platform about fab operations, models, or data..."
              className="w-full pl-5 pr-14 py-4 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white transition-colors"
              disabled={!activeSessionId || isSending}
            />
            <button
              type="submit"
              disabled={!activeSessionId || !inputValue.trim() || isSending}
              className="absolute right-2 p-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>

      </div>

    </div>
  );
}
