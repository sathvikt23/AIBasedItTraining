import { motion } from 'framer-motion';

export default function BookLayout({ metadata }) {
  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '32px'
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
        borderRadius: '16px',
        padding: '32px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        border: '1px solid #374151'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          marginBottom: '24px'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)'
          }}>
            <svg style={{ width: '32px', height: '32px' }} fill="none" stroke="white" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5.754 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332 4.5 1.253m0-13C13.168 5.477 14.754 5.754 18 7.5 18s3.332 4.5 1.253" />
            </svg>
          </div>
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '4px'
            }}>
              <span style={{
                padding: '6px 12px',
                background: 'rgba(245, 158, 11, 0.1)',
                color: '#d97706',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: '600'
              }}>
                Published
              </span>
              <span style={{
                padding: '6px 12px',
                background: 'rgba(59, 130, 246, 0.1)',
                color: '#3b82f6',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: '600'
              }}>
                Enterprise
              </span>
            </div>
            <h1 style={{
              fontSize: '32px',
              fontWeight: 'bold',
              margin: 0,
              color: '#ffffff',
              fontFamily: 'Georgia, serif'
            }}>
              {metadata.title || "Book Title"}
            </h1>
          </div>
        </div>
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '24px',
          fontSize: '14px',
          color: '#9ca3af'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2v-12a2 2 0 002-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>Updated {new Date().toLocaleDateString()}</span>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0118 0z" />
            </svg>
            <span>5 min read</span>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0118 0z" />
            </svg>
            <span>1.2k views</span>
          </div>
        </div>
      </div>
      
      <div style={{ padding: '32px' }}>
        <div style={{
          background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
          borderRadius: '16px',
          padding: '32px',
          border: '1px solid #374151',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
        }}>
          <h3 style={{
            fontSize: '20px',
            fontWeight: 'bold',
            margin: '0 0 24px 0',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <svg style={{ width: '24px', height: '24px' }} fill="none" stroke="#f59e0b" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h18v4H8" />
            </svg>
            About This Content
          </h3>
          <p style={{
            fontSize: '16px',
            lineHeight: '1.6',
            color: '#d1d5db',
            marginBottom: '32px'
          }}>
            This is an enterprise-grade document template designed for professional content delivery. 
            It features a clean, modern layout with optimal readability and visual hierarchy.
            The responsive design ensures excellent user experience across all devices.
          </p>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px',
            marginTop: '32px'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid #3b82f6'
            }}>
              <h4 style={{
                fontSize: '18px',
                fontWeight: '600',
                margin: '0 0 16px 0',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="white" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Key Features
              </h4>
              <ul style={{
                margin: 0,
                paddingLeft: '20px',
                color: '#ffffff'
              }}>
                <li style={{ marginBottom: '12px' }}>Professional enterprise design</li>
                <li style={{ marginBottom: '12px' }}>Responsive layout system</li>
                <li style={{ marginBottom: '12px' }}>Dynamic metadata support</li>
              </ul>
            </div>
            
            <div style={{
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid #10b981'
            }}>
              <h4 style={{
                fontSize: '18px',
                fontWeight: '600',
                margin: '0 0 16px 0',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="white" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Quick Actions
              </h4>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                <button style={{
                  padding: '12px 16px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: '#ffffff',
                  border: '1px solid #10b981',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  width: '100%',
                  transition: 'all 0.2s'
                }}>
                  📄 Export as PDF
                </button>
                <button style={{
                  padding: '12px 16px',
                  background: 'transparent',
                  color: '#ffffff',
                  border: '1px solid #10b981',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  width: '100%',
                  transition: 'all 0.2s'
                }}>
                  📤 Share Document
                </button>
                <button style={{
                  padding: '12px 16px',
                  background: 'transparent',
                  color: '#ffffff',
                  border: '1px solid #10b981',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  width: '100%',
                  transition: 'all 0.2s'
                }}>
                  🖨️ Print Version
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
