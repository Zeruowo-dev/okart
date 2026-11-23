import React, { useEffect, useRef, useState } from 'react';
import { MessageSquare, Phone, Send, X } from 'lucide-react';
import { OKART_CONTACT } from '../data/siteContent';
import { generateChatReply } from '../utils/storeLogic';

interface ChatMessage {
  id: string;
  sender: 'client' | 'okart';
  text: string;
  timestamp: string;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-welcome',
    sender: 'okart',
    text: 'Welcome to OKART Interiors. How can we assist with your bespoke furniture, kitchen cabinetry, or interior project today?',
    timestamp: 'Online now',
  },
];

const QUICK_PROMPTS = [
  'Quote for The Heritage Dining Chair',
  'Book Ibadan showroom visit',
  'Bespoke kitchen cabinetry inquiry',
];

export function LiveChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const scrollEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      scrollEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isOpen, messages]);

  const sendMessage = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const clientMsg: ChatMessage = {
      id: `c-${Date.now()}`,
      sender: 'client',
      text: trimmed,
      timestamp: 'Just now',
    };
    const replyMsg: ChatMessage = {
      id: `o-${Date.now() + 1}`,
      sender: 'okart',
      text: generateChatReply(trimmed),
      timestamp: 'OKART Atelier',
    };

    setMessages((prev) => [...prev, clientMsg, replyMsg]);
    setInput('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      {isOpen && (
        <section
          aria-label="OKART Interiors Live Chat"
          className="w-[330px] sm:w-[370px] bg-white border border-[#D5D4D3] shadow-2xl flex flex-col overflow-hidden"
        >
          {/* Chat Header */}
          <div className="bg-[#EDE5D5] text-[#2B1E12] border-b border-[#D5C9B4] px-5 py-4 flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.18em] text-[#82674F]">
                OKART Interiors Direct
              </p>
              <h3 className="font-serif-display text-[22px] leading-tight mt-0.5">
                Live Design Chat
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close live chat"
              className="p-1.5 text-[#4F3926] hover:text-[#2B1E12] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Direct Channels Bar */}
          <div className="bg-[#F6F5F3] px-4 py-2 border-b border-[#E1E0DD] flex items-center justify-between text-[11px] text-[#2B1E12]">
            <span>WhatsApp &amp; Tel: {OKART_CONTACT.phone}</span>
            <a
              href={OKART_CONTACT.whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 underline text-[#82674F] hover:text-[#2B1E12]"
            >
              <Phone className="w-3 h-3" />
              WhatsApp
            </a>
          </div>

          {/* Messages */}
          <div className="h-72 overflow-y-auto p-4 space-y-3 bg-[#F6F5F3]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.sender === 'client' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-[85%] px-3.5 py-2.5 text-[12px] leading-relaxed ${
                    msg.sender === 'client'
                      ? 'bg-[#EDE5D5] border border-[#D5C9B4] text-[#2B1E12]'
                      : 'bg-white border border-[#E1E0DD] text-[#1C1C1C]'
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[10px] text-[#82674F] mt-1">{msg.timestamp}</span>
              </div>
            ))}
            <div ref={scrollEndRef} />
          </div>

          {/* Quick Replies */}
          <div className="px-3 py-2 bg-white border-t border-[#E1E0DD] flex flex-wrap gap-1.5">
            {QUICK_PROMPTS.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => sendMessage(q)}
                className="px-2.5 py-1 rounded-full bg-[#F6F5F3] border border-[#D5D4D3] text-[10px] text-[#4F3926] hover:border-[#82674F] cursor-pointer"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <form
            onSubmit={handleSubmit}
            className="p-3 bg-white border-t border-[#E1E0DD] flex items-center gap-2"
          >
            <label htmlFor="live-chat-input" className="sr-only">
              Message OKART Interiors
            </label>
            <input
              id="live-chat-input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Write your enquiry..."
              className="flex-1 h-9 px-3 bg-[#F6F5F3] border border-[#D5D4D3] text-[12px] text-[#1C1C1C] focus:outline-none focus:border-[#82674F]"
            />
            <button
              type="submit"
              aria-label="Send chat message"
              className="h-9 px-3.5 rounded-full bg-[#EDE5D5] hover:bg-[#DFD2BC] border border-[#B9A78B] text-[#2B1E12] flex items-center justify-center cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </section>
      )}

      {/* Floating Launcher Pill */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? 'Minimize live chat' : 'Chat with OKART Interiors'}
        className="h-12 px-5 rounded-full bg-[#EDE5D5] hover:bg-[#DFD2BC] text-[#2B1E12] shadow-xl border border-[#B9A78B] flex items-center gap-2.5 text-[11px] uppercase tracking-[0.14em] transition-transform hover:scale-[1.02] cursor-pointer"
      >
        <MessageSquare className="w-4 h-4" />
        <span>{isOpen ? 'Close Chat' : 'Chat with Us'}</span>
      </button>
    </div>
  );
}
