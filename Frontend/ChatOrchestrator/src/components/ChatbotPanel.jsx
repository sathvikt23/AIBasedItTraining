import { motion } from 'framer-motion';
import { 
  Bot, 
  Settings, 
  Code2, 
  MessageSquare, 
  Send, 
  Sparkles,
  ChevronDown,
  Copy,
  Check,
  RefreshCw,
  Trash2
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { Button, Card, Textarea } from './UI';
 
export default function ChatbotPanel({ config, setConfig }) {
  const [jsonInput, setJsonInput] = useState(JSON.stringify(config, null, 2));
  const [jsonError, setJsonError] = useState('');
  const [activeTab, setActiveTab] = useState('editor');
  const [copied, setCopied] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: ' Welcome to Code Compass ! How can i help you ',
      timestamp: new Date().toISOString()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
 
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
 
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
 
  const handleJsonChange = (value) => {
    setJsonInput(value);
    setJsonError('');
    
    try {
      const parsedConfig = JSON.parse(value);
      setConfig(parsedConfig);
    } catch (error) {
      setJsonError('❌ Invalid JSON format');
    }
  };
 
  const formatJson = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      const formatted = JSON.stringify(parsed, null, 2);
      setJsonInput(formatted);
      setJsonError('');
    } catch (error) {
      setJsonError('❌ Cannot format invalid JSON');
    }
  };
 
  const copyToClipboard = () => {
    navigator.clipboard.writeText(jsonInput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
 
  const resetToDefault = () => {
    const defaultConfig = {
      component_name: "dashboard",
      metadata: {
        title: "My Dashboard",
        content: "Sample text"
      }
    };
    setJsonInput(JSON.stringify(defaultConfig, null, 2));
    setConfig(defaultConfig);
    setJsonError('');
  };
 
  const applyPreset = (preset) => {
    setJsonInput(JSON.stringify(preset, null, 2));
    setConfig(preset);
    setJsonError('');
  };
 
  const presets = {
    dashboard: {
      component_name: "dashboard",
      metadata: {
        title: "Enterprise Dashboard",
        content: "Real-time analytics and insights"
      }
    },
    book: {
      component_name: "book",
      metadata: {
        title: "Technical Documentation",
        content: "Comprehensive guide for developers"
      }
    }
  };
 
  // Deep merge utility — only overwrites keys present in source
  const deepMerge = (target, source) => {
    const result = { ...target };
    for (const key in source) {
      if (
        source[key] &&
        typeof source[key] === 'object' &&
        !Array.isArray(source[key]) &&
        target[key] &&
        typeof target[key] === 'object'
      ) {
        result[key] = deepMerge(target[key], source[key]);
      } else {
        result[key] = source[key];
      }
    }
    return result;
  };
 
  const generateBotResponse = async (message) => {
    const response = await fetch('http://localhost:8032/api/v1/ask_aiagent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `user_question: ${message} context: ${JSON.stringify(config)}`
      })
    });
 
    const data = await response.json();
    const rawText = data?.response || data?.content?.[0]?.text || data?.text || '';
 
    // Parse <response> and <json> blocks
    const responseMatch = rawText.match(/<response>([\s\S]*?)<\/response>/);
    const jsonMatch = rawText.match(/<json>([\s\S]*?)<\/json>/);
 
    const botText = responseMatch ? responseMatch[1].trim() : rawText;
 
    if (jsonMatch) {
      try {
        const parsedJson = JSON.parse(jsonMatch[1].trim());
        const mergedConfig = deepMerge(config, parsedJson);
        setConfig(mergedConfig);
        setJsonInput(JSON.stringify(mergedConfig, null, 2));
      } catch (e) {
        console.error('Failed to parse JSON from LLM response:', e);
      }
    }
 
    return botText;
  };
 
  const sendMessage = async () => {
    if (!inputMessage.trim()) return;
 
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date().toISOString()
    };
 
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);
 
    try {
      const botResponse = {
        id: Date.now() + 1,
        type: 'bot',
        content: await generateBotResponse(inputMessage),
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error('API error:', error);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        type: 'bot',
        content: 'Something went wrong. Please try again.',
        timestamp: new Date().toISOString()
      }]);
    } finally {
      setIsTyping(false);
    }
  };
 

  return (
    <div style={{
      height: '100%',
      background: 'linear-gradient(to bottom, #1a1a1a, #262626)',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <div style={{
        padding: '5px',
        borderBottom: '1px solid #404040',
        background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.1) 0%, rgba(37, 99, 235, 0.05) 100%)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
           
          
           
            
          </div>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(37, 99, 235, 0.1)',
            padding: '8px 100px',
            borderRadius: '16px'
          }}>
            <button
              onClick={() => setActiveTab('editor')}
              style={{
                padding: '8px 12px',
                background: activeTab === 'editor' ? '#ffffff' : 'transparent',
                color: activeTab === 'editor' ? '#2563eb' : '#94a3b8',
                border: '1px solid #404040',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: '500',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Code2 style={{ width: '14px', height: '14px' }} />
              <span>Editor</span>
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              style={{
                padding: '8px 12px',
                background: activeTab === 'chat' ? '#ffffff' : 'transparent',
                color: activeTab === 'chat' ? '#2563eb' : '#94a3b8',
                border: '1px solid #404040',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: '500',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <MessageSquare style={{ width: '14px', height: '14px' }} />
              <span>Chat</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: 'hidden' }}>
        {activeTab === 'editor' && (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* Action Bar */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px 20px',
              borderBottom: '1px solid #333333'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <Sparkles style={{ width: '16px', height: '16px', color: '#f59e0b' }} />
                <span style={{
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#ffffff'
                }}>JSON Editor</span>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <button
                  onClick={formatJson}
                  style={{
                    padding: '6px 12px',
                    background: 'transparent',
                    color: '#94a3b8',
                    border: '1px solid #404040',
                    borderRadius: '6px',
                    fontSize: '12px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <RefreshCw style={{ width: '14px', height: '14px' }} />
                  <span>Format</span>
                </button>
                <button
                  onClick={copyToClipboard}
                  style={{
                    padding: '6px 12px',
                    background: 'transparent',
                    color: '#94a3b8',
                    border: '1px solid #404040',
                    borderRadius: '6px',
                    fontSize: '12px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  {copied ? (
                    <Check style={{ width: '14px', height: '14px', color: '#10b981' }} />
                  ) : (
                    <Copy style={{ width: '14px', height: '14px' }} />
                  )}
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>
                <button
                  onClick={resetToDefault}
                  style={{
                    padding: '6px 12px',
                    background: 'transparent',
                    color: '#ef4444',
                    border: '1px solid #404040',
                    borderRadius: '6px',
                    fontSize: '12px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <Trash2 style={{ width: '14px', height: '14px' }} />
                  <span>Reset</span>
                </button>
              </div>
            </div>

            {/* JSON Editor */}
            <div style={{ flex: 1, position: 'relative' }}>
              <textarea
                value={jsonInput}
                onChange={(e) => handleJsonChange(e.target.value)}
                style={{
                  width: '100%',
                  height: '100%',
                  padding: '16px',
                  fontFamily: 'monospace',
                  fontSize: '13px',
                  lineHeight: '1.5',
                  color: '#ffffff',
                  backgroundColor: '#0d1117',
                  border: '1px solid #333333',
                  borderRadius: '8px',
                  resize: 'none',
                  outline: 'none'
                }}
                placeholder="Enter JSON configuration..."
                spellCheck={false}
              />
              {jsonError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    position: 'absolute',
                    bottom: '16px',
                    left: '16px',
                    right: '16px',
                    padding: '12px',
                    backgroundColor: 'rgba(239, 68, 68, 0.9)',
                    border: '1px solid #ef4444',
                    borderRadius: '8px',
                    color: '#ffffff'
                  }}
                >
                  <p style={{ margin: 0, fontSize: '12px' }}>{jsonError}</p>
                </motion.div>
              )}
            </div>

            {/* Presets */}
            <div style={{
              padding: '16px 20px',
              borderTop: '1px solid #333333'
            }}>
              <h3 style={{
                fontSize: '14px',
                fontWeight: '500',
                margin: '0 0 12px 0',
                color: '#ffffff'
              }}>Quick Presets</h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '12px'
              }}>
                <button
                  onClick={() => applyPreset(presets.dashboard)}
                  style={{
                    padding: '12px',
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: '#ffffff',
                    border: '1px solid #10b981',
                    borderRadius: '8px',
                    fontSize: '13px',
                    cursor: 'pointer',
                    fontWeight: '500'
                  }}
                >
                  📊 Dashboard
                </button>
                <button
                  onClick={() => applyPreset(presets.book)}
                  style={{
                    padding: '12px',
                    background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                    color: '#ffffff',
                    border: '1px solid #22c55e',
                    borderRadius: '8px',
                    fontSize: '13px',
                    cursor: 'pointer',
                    fontWeight: '500'
                  }}
                >
                  📚 Book Layout
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'chat' && (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* Messages */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    display: 'flex',
                    flexDirection: message.type === 'user' ? 'row-reverse' : 'row'
                  }}
                >
                  <div style={{
                    maxWidth: '80%',
                    display: 'flex',
                    flexDirection: 'column'
                  }}>
                    <div
                      style={{
                        padding: '12px 16px',
                        borderRadius: '16px',
                        background: message.type === 'user' 
                          ? 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 50%, #1e40af 100%)'
                          : 'linear-gradient(135deg, #374151 0%, #1f2937 50%, #111827 100%)',
                        color: '#ffffff',
                        wordBreak: 'break-word'
                      }}
                    >
                      <p style={{ margin: 0, fontSize: '14px', whiteSpace: 'pre-line' }}>{message.content}</p>
                    </div>
                    <p style={{
                      fontSize: '11px',
                      color: '#6b7280',
                      margin: '4px 0 0 0',
                      textAlign: message.type === 'user' ? 'right' : 'left'
                    }}>
                      {new Date(message.timestamp).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </motion.div>
              ))}
              
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    display: 'flex',
                    flexDirection: 'row'
                  }}
                >
                  <div style={{
                    padding: '12px 16px',
                    borderRadius: '16px',
                    background: 'linear-gradient(135deg, #374151 0%, #1f2937 50%, #111827 100%)',
                    color: '#ffffff'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <div style={{
                        display: 'flex',
                        gap: '4px'
                      }}>
                        <div style={{
                          width: '8px',
                          height: '8px',
                          backgroundColor: '#9ca3af',
                          borderRadius: '50%'
                        }}></div>
                        <div style={{
                          width: '8px',
                          height: '8px',
                          backgroundColor: '#9ca3af',
                          borderRadius: '50%'
                        }}></div>
                        <div style={{
                          width: '8px',
                          height: '8px',
                          backgroundColor: '#9ca3af',
                          borderRadius: '50%'
                        }}></div>
                      </div>
                      <span style={{ fontSize: '14px' }}>Thinking...</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Input */}
            <div style={{
              padding: '16px',
              borderTop: '1px solid #333333'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Ask me about your configuration..."
                  style={{
                    flex: 1,
                    padding: '12px 16px',
                    background: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    fontSize: '14px',
                    color: '#ffffff',
                    outline: 'none'
                  }}
                />
                <button
                  onClick={sendMessage}
                  disabled={!inputMessage.trim()}
                  style={{
                    padding: '12px',
                    background: inputMessage.trim() ? '#2563eb' : '#374151',
                    color: '#ffffff',
                    border: '1px solid #2563eb',
                    borderRadius: '8px',
                    fontSize: '14px',
                    cursor: inputMessage.trim() ? 'pointer' : 'not-allowed',
                    fontWeight: '500'
                  }}
                >
                  <Send style={{ width: '16px', height: '16px' }} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
