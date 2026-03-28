import { useState } from 'react';
import ChatbotPanel from '../components/ChatbotPanel';
import LayoutRenderer from '../renderer/LayoutRenderer';

export default function BuilderScreen() {
  const [config, setConfig] = useState({
    component_name: "dashboard",
    metadata: {
      title: "My Dashboard",
      content: "Sample text"
    }
  });

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#0a0a0a',
      margin: 0,
      padding: 0,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      
      {/* Modern Dark Header */}
      <div style={{
        height: '80px',
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)',
        borderBottom: '1px solid #404040',
        display: 'flex',
        alignItems: 'center',
        padding: '0 40px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Animated background effect */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(45deg, transparent 30%, rgba(59, 130, 246, 0.05) 50%, transparent 70%)',
          animation: 'shimmer 3s ease-in-out infinite'
        }}></div>
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          position: 'relative',
          zIndex: 1
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 50%, #1e40af 100%)',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 24px rgba(37, 99, 235, 0.3)',
            border: '1px solid rgba(37, 99, 235, 0.2)'
          }}>
            <span style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: 'white',
              textShadow: '0 2px 4px rgba(0,0,0,0.4)'
            }}>G</span>
          </div>
          <div>
            <h1 style={{
              fontSize: '28px',
              fontWeight: '800',
              margin: 0,
              color: '#ffffff',
              textShadow: '0 2px 8px rgba(37, 99, 235, 0.3)',
              letterSpacing: '-0.5px'
            }}>Govinda Builder</h1>
            <p style={{
              fontSize: '13px',
              margin: '4px 0 0 0',
              color: '#94a3b8',
              fontWeight: '500'
            }}>Dynamic Component Configuration</p>
          </div>
        </div>
        
        <div style={{
          marginLeft: 'auto',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          position: 'relative',
          zIndex: 1
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '12px 7px',
            background: 'rgba(37, 99, 235, 0.1)',
            borderRadius: '24px',
            border: '1px solid rgba(37, 99, 235, 0.3)',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{
              width: '10px',
              height: '10px',
              backgroundColor: '#10b981',
              borderRadius: '50%',
              boxShadow: '0 0 12px #10b981',
              animation: 'pulse 2s ease-in-out infinite'
            }}></div>
            <span style={{
              fontSize: '15px',
              fontWeight: '600',
              color: '#ffffff'
            }}>Live Preview</span>
          </div>
        </div>
      </div>

      {/* Main Content - Dark Theme */}
      <div style={{
        display: 'flex',
        flex: 1,
        overflow: 'hidden',
        background: 'linear-gradient(180deg, #0a0a0a 0%, #1a1a1a 100%)'
      }}>
        
        {/* LEFT PANEL - AI Assistant */}
        <div style={{
          width: '420px',
          background: 'linear-gradient(180deg, #1a1a1a 0%, #262626 100%)',
          borderRight: '1px solid #404040',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '8px 0 24px rgba(0,0,0,0.2)',
          position: 'relative'
        }}>
          {/* Glow effect */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(90deg, transparent 0%, rgba(37, 99, 235, 0.05) 50%, transparent 100%)',
            pointerEvents: 'none'
          }}></div>
          
          <div style={{
            padding: '7.5px',
            borderBottom: '1px solid #404040',
            background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.1) 0%, rgba(37, 99, 235, 0.05) 100%)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <span style={{
                fontSize: '28px',
                filter: 'drop-shadow(0 0 8px rgba(37, 99, 235, 0.6))'
              }}>🤖</span>
            </div>
          </div>
          <div style={{
            padding: '24px',
            flex: 1,
            overflow: 'auto',
            backgroundColor: 'rgba(10, 10, 10, 0.5)'
          }}>
            <ChatbotPanel config={config} setConfig={setConfig} />
          </div>
        </div>

        {/* RIGHT PANEL - Component Preview */}
        <div style={{
          flex: 1,
          background: 'linear-gradient(180deg, #1a1a1a 0%, #0a0a0a 100%)',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative'
        }}>
          {/* Subtle grid pattern */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `
              linear-gradient(rgba(37, 99, 235, 0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(37, 99, 235, 0.03) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px',
            pointerEvents: 'none'
          }}></div>
          
          <div style={{
            padding: '10px',
            borderBottom: '1px solid #404040',
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'relative',
            zIndex: 1
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
              gap: '16px'
            }}>
              <div style={{
                padding: '8px 16px',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: '#ffffff',
                borderRadius: '20px',
                fontSize: '13px',
                fontWeight: '600',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                {config.component_name}
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '2px',
                padding: '8px 16px',
                background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                borderRadius: '20px',
                border: '1px solid rgba(34, 197, 94, 0.3)',
                boxShadow: '0 4px 12px rgba(34, 197, 94, 0.2)'
              }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  backgroundColor: '#ffffff',
                  borderRadius: '50%',
                  boxShadow: '0 0 8px #ffffff'
                }}></div>
                <span style={{
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#ffffff',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>Valid</span>
              </div>
            </div>
          </div>
          
          <div style={{
            flex: 1,
            padding: '40px',
            overflow: 'auto',
            background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.8) 0%, rgba(10, 10, 10, 0.9) 100%)',
            borderRadius: '20px',
            margin: '24px',
            border: '1px solid rgba(37, 99, 235, 0.2)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
            position: 'relative',
            zIndex: 1
          }}>
            {/* Inner glow effect */}
            <div style={{
              position: 'absolute',
              top: -1,
              left: -1,
              right: -1,
              bottom: -1,
              background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.1) 0%, transparent 50%, rgba(16, 185, 129, 0.1) 100%)',
              borderRadius: '20px',
              pointerEvents: 'none'
            }}></div>
            
            <LayoutRenderer config={config} />
          </div>
        </div>
      </div>
      
      {/* Add CSS animations */}
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
