import React, { useState, useRef, useEffect } from 'react';
import axios from "axios";
import "./chatbox.css";

const ChatBox = () => {
    const [messages, setMessages] = useState([
        {
            type: 'bot',
            content: "Hello! I'm your AI assistant. How can I help you today?"
        }
    ]);
    const [userInput, setUserInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleResponse = async () => {
        if (!userInput.trim()) return;

        const newMessage = { type: 'user', content: userInput };
        setMessages(prev => [...prev, newMessage]);
        setIsLoading(true);
        setUserInput("");

        try {
            const response = await axios.post("/chatresponse", {
                ques: userInput
            });
            
            setMessages(prev => [...prev, {
                type: 'bot',
                content: response.data.anaylsis
            }]);
        } catch (error) {
            setMessages(prev => [...prev, {
                type: 'error',
                content: "Sorry, I encountered an error. Please try again."
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleResponse();
        }
    };

    return (
        <div className="chatgpt-container">
            <aside className="chatgpt-sidebar">
                <div className="new-chat-btn">
                    <i className="fas fa-plus"></i>
                    New chat
                </div>
                <div className="chat-history">
                    {/* Chat history items can be added here */}
                </div>
                <div className="sidebar-footer">
                    <div className="sidebar-item">
                        <i className="fas fa-trash"></i>
                        Clear conversations
                    </div>
                    <div className="sidebar-item">
                        <i className="fas fa-moon"></i>
                        Dark mode
                    </div>
                </div>
            </aside>

            <main className="chatgpt-main">
                <div className="messages-container">
                    {messages.map((message, index) => (
                        <div 
                            key={index} 
                            className={`message-row ${message.type}-row`}
                        >
                            <div className="message-content">
                                <div className="message-avatar">
                                    {message.type === 'bot' ? 
                                        <i className="fas fa-robot"></i> : 
                                        <i className="fas fa-user"></i>
                                    }
                                </div>
                                <div className="message-text">
                                    {message.content}
                                </div>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="message-row bot-row">
                            <div className="message-content">
                                <div className="message-avatar">
                                    <i className="fas fa-robot"></i>
                                </div>
                                <div className="message-text">
                                    <div className="typing-indicator">
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <div className="input-footer">
                    <div className="input-container">
                        <textarea
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Send a message..."
                            rows="1"
                        />
                        <button 
                            onClick={handleResponse}
                            disabled={isLoading || !userInput.trim()}
                            className={`send-button ${isLoading ? 'loading' : ''}`}
                        >
                            {isLoading ? (
                                <span className="loading-spinner"></span>
                            ) : (
                                <i className="fas fa-paper-plane"></i>
                            )}
                        </button>
                    </div>
                    <div className="input-footer-text">
                        Free Research Preview. ChatGPT may produce inaccurate information.
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ChatBox;