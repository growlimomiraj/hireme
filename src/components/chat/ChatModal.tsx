import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Send, Image, Lock, CheckCheck } from 'lucide-react';

export const ChatModal: React.FC = () => {
  const {
    activeChatRequestId,
    setActiveChatRequestId,
    messages,
    sendMessage,
    requests,
    role,
    currentUser,
    currentProvider
  } = useApp();

  const [inputVal, setInputVal] = useState('');

  if (!activeChatRequestId) return null;

  const currentReq = requests.find(r => r.id === activeChatRequestId);
  const chatMessages = messages.filter(m => m.requestId === activeChatRequestId);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    sendMessage(activeChatRequestId, inputVal.trim());
    setInputVal('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full h-[600px] max-h-[90vh] flex flex-col shadow-2xl border border-gray-200 animate-in fade-in zoom-in-95">
        
        {/* Chat Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center font-bold text-gray-700">
              💬
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-[#151515]">
                {currentReq?.title || "Job Negotiation"}
              </h3>
              <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
                <Lock size={10} />
                <span>Exact address kept private during pre-booking</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setActiveChatRequestId(null)}
            className="p-1.5 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* Messages Scroll View */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50/50 text-xs">
          {chatMessages.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p>No messages yet. Ask a question about tools, parts, or arrival time!</p>
            </div>
          ) : (
            chatMessages.map(msg => {
              const isMine = (role === 'customer' && msg.senderRole === 'customer') ||
                             (role === 'provider' && msg.senderRole === 'provider');

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                >
                  <span className="text-[10px] text-gray-400 font-semibold mb-0.5 px-1">
                    {msg.senderName}
                  </span>
                  <div
                    className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl shadow-sm text-xs ${
                      isMine
                        ? 'bg-[#151515] text-[#B5F33D] rounded-tr-none'
                        : 'bg-white text-gray-800 border border-gray-200 rounded-tl-none'
                    }`}
                  >
                    <p>{msg.text}</p>
                    <div className="flex items-center justify-end gap-1 mt-1 text-[9px] opacity-70">
                      <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      <CheckCheck size={11} />
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-200 flex items-center gap-2">
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Type your message or question..."
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#B5F33D]"
          />
          <button
            type="submit"
            className="p-2.5 bg-[#B5F33D] hover:bg-[#a6e632] text-black rounded-xl shadow active:scale-95 transition-all"
          >
            <Send size={16} />
          </button>
        </form>

      </div>
    </div>
  );
};
