import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Chat } from '@google/genai';
import type { ChatMessage } from '../types';

const ChatIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.455.09-.934.09-1.423A7.927 7.927 0 0 1 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
    </svg>
);

const CloseIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
    </svg>
);

const SendIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
    </svg>
);


const Chatbot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chat = useRef<Chat | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const ai = new GoogleGenAI({apiKey: process.env.API_KEY as string});
        chat.current = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction: "You are a helpful assistant named 'Onchain AI' specializing in Bitcoin on-chain data. Explain concepts like MVRV, NUPL, Puell Multiple, and the Halving Cycle in a simple, easy-to-understand way for beginners. Always answer in Korean. If asked about something other than Bitcoin, cryptocurrency, or on-chain data, politely decline to answer, stating that you specialize in Bitcoin data analysis.",
            }
        });

        setMessages([
            { role: 'model', text: '안녕하세요! 저는 온체인 AI입니다. 비트코인 온체인 데이터에 대해 궁금한 점이 있으신가요? 무엇이든 물어보세요.' }
        ]);
    }, []);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);
    
    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading || !chat.current) return;
    
        const userMessage: ChatMessage = { role: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        const currentInput = input;
        setInput('');
        setIsLoading(true);
    
        try {
            const result = await chat.current.sendMessageStream({ message: currentInput });
            
            let firstChunk = true;
            let text = '';
            for await (const chunk of result) {
                text += chunk.text;
                if (firstChunk) {
                    setMessages(prev => [...prev, { role: 'model', text }]);
                    firstChunk = false;
                } else {
                    setMessages(prev => {
                        const newMessages = [...prev];
                        newMessages[newMessages.length - 1].text = text;
                        return newMessages;
                    });
                }
            }
        } catch (error) {
            console.error('Gemini API Error:', error);
            setMessages(prev => [...prev, { role: 'model', text: '죄송합니다. 답변을 생성하는 동안 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' }]);
        } finally {
            setIsLoading(false);
        }
    };
    

    return (
        <div className="fixed bottom-5 right-5 z-50 font-sans">
            {isOpen ? (
                <div className="w-[calc(100vw-40px)] sm:w-96 h-[70vh] max-h-[600px] bg-slate-900/80 backdrop-blur-md border border-slate-700 rounded-2xl shadow-2xl flex flex-col origin-bottom-right animate-scale-in">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-slate-700 flex-shrink-0">
                        <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">온체인 AI 어시스턴트</h3>
                        <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors" aria-label="Close chat">
                            <CloseIcon className="w-6 h-6"/>
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 p-4 overflow-y-auto space-y-4">
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex items-end gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                {msg.role === 'model' && <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-sm font-bold">AI</span>}
                                <div className={`max-w-[80%] p-3 rounded-2xl whitespace-pre-wrap break-words ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-slate-700 text-slate-200 rounded-bl-none'}`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                           <div className="flex items-end gap-2 justify-start">
                                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-sm font-bold">AI</span>
                                <div className="max-w-[80%] p-3 rounded-2xl bg-slate-700 text-slate-200 rounded-bl-none">
                                    <div className="flex items-center gap-1">
                                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-pulse"></span>
                                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-pulse [animation-delay:0.2s]"></span>
                                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-pulse [animation-delay:0.4s]"></span>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-4 border-t border-slate-700 flex-shrink-0">
                        <form onSubmit={handleSend} className="flex items-center gap-2">
                            <input
                                ref={inputRef}
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="무엇이든 물어보세요..."
                                className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2 px-4 text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-shadow"
                                disabled={isLoading}
                                aria-label="Chat input"
                            />
                            <button type="submit" disabled={isLoading || !input.trim()} className="p-2 rounded-full bg-cyan-500 text-white disabled:bg-slate-600 disabled:cursor-not-allowed hover:bg-cyan-400 transition-colors flex-shrink-0" aria-label="Send message">
                                <SendIcon className="w-6 h-6"/>
                            </button>
                        </form>
                    </div>
                </div>
            ) : (
                <button onClick={() => setIsOpen(true)} className="bg-cyan-500 hover:bg-cyan-400 text-white rounded-full p-4 shadow-lg transition-transform hover:scale-110 origin-bottom-right animate-scale-in" aria-label="Open chat">
                    <ChatIcon className="w-8 h-8"/>
                </button>
            )}
        </div>
    );
};

export default Chatbot;