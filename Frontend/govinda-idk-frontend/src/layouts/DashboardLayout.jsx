import { motion } from 'framer-motion';
import { 
  DollarSign, 
  Users, 
  BarChart3, 
  TrendingUp,
  Activity,
  Server,
  Database,
  HardDrive
} from 'lucide-react';

export default function DashboardLayout({ metadata }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  const statsCards = [
    {
      title: "Revenue",
      value: "$45,231",
      change: "+12.5%",
      changeType: "positive",
      icon: DollarSign,
      color: "green",
      delay: 0.1
    },
    {
      title: "Users",
      value: "2,543",
      change: "+8.2%",
      changeType: "positive",
      icon: Users,
      color: "blue",
      delay: 0.2
    },
    {
      title: "Analytics",
      value: "89.2%",
      change: "+3.1%",
      changeType: "positive",
      icon: BarChart3,
      color: "purple",
      delay: 0.3
    }
  ];

  const activities = [
    { id: 1, title: "New user registration", time: "2 minutes ago", color: "green" },
    { id: 2, title: "Payment processed", time: "15 minutes ago", color: "blue" },
    { id: 3, title: "Report generated", time: "1 hour ago", color: "purple" }
  ];

  const metrics = [
    { name: "Server Response Time", value: "124ms", percentage: 75, color: "green" },
    { name: "Database Load", value: "45%", percentage: 45, color: "blue" },
    { name: "Memory Usage", value: "2.1GB", percentage: 60, color: "purple" }
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      style={{ width: '100%' }}
    >
      {/* Header */}
      <motion.div
        variants={itemVariants}
        style={{
          background: 'linear-gradient(135deg, #1e40af 0%, #374151 50%, #111827 100%)',
          borderRadius: '16px',
          padding: '32px',
          marginBottom: '32px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
        }}
      >
        <h1 style={{
          fontSize: '32px',
          fontWeight: 'bold',
          margin: 0,
          color: '#ffffff',
          textShadow: '0 2px 8px rgba(0,0,0,0.2)'
        }}>
          {metadata.title || "Dashboard"}
        </h1>
        <p style={{
          fontSize: '16px',
          color: '#d1d5db',
          marginTop: '8px'
        }}>
          Welcome to your enterprise dashboard
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={containerVariants}
        style={{ marginBottom: '32px' }}
      >
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px'
        }}>
          {statsCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              variants={itemVariants}
              whileHover={{ 
                scale: 1.02,
                boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 25px -5px rgba(0,0,0,0.04)"
              }}
              style={{
                background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid #374151',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '16px'
              }}>
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                  style={{
                    width: '48px',
                    height: '48px',
                    background: `linear-gradient(135deg, #${stat.color === 'green' ? '10b981' : stat.color === 'blue' ? '#3b82f6' : '#8b5cf6'} 0%, #${stat.color === 'green' ? '#059669' : stat.color === 'blue' ? '#1d4ed8' : '#7c3aed'} 50%)`,
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                  }}
                >
                  <stat.icon style={{ width: '24px', height: '24px', color: '#ffffff' }} />
                </motion.div>
                <span style={{
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#6b7280'
                }}>{stat.title}</span>
              </div>
              
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: stat.delay + 0.5 }}
                  style={{
                    fontSize: '28px',
                    fontWeight: 'bold',
                    margin: 0,
                    color: '#ffffff'
                  }}
                >
                  {stat.value}
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: stat.delay + 0.7 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <TrendingUp style={{ 
                    width: '16px', 
                    height: '16px', 
                    color: stat.changeType === 'positive' ? '#10b981' : '#ef4444' 
                  }} />
                  <span style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: stat.changeType === 'positive' ? '#10b981' : '#ef4444'
                  }}>
                    {stat.change} from last month
                  </span>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Activity and Metrics */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '32px'
      }}>
        {/* Recent Activity */}
        <motion.div
          variants={itemVariants}
          style={{
            background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid #374151',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
          }}
        >
          <h3 style={{
            fontSize: '20px',
            fontWeight: 'bold',
            margin: '0 0 16px 0',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <Activity style={{ 
              width: '20px', 
              height: '20px', 
              color: '#60a5fa' 
            }} />
            Recent Activity
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {activities.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ x: 5 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '16px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '12px',
                  cursor: 'pointer'
                }}
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{
                    width: '8px',
                    height: '8px',
                    backgroundColor: `#${activity.color === 'green' ? '10b981' : activity.color === 'blue' ? '#3b82f6' : '#8b5cf6'}`,
                    borderRadius: '50%'
                  }}
                />
                <div style={{ flex: 1 }}>
                  <p style={{
                    fontSize: '14px',
                    fontWeight: 'medium',
                    margin: 0,
                    color: '#ffffff'
                  }}>{activity.title}</p>
                  <p style={{
                    fontSize: '12px',
                    color: '#9ca3af',
                    marginTop: '4px'
                  }}>{activity.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Performance Metrics */}
        <motion.div
          variants={itemVariants}
          style={{
            background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid #374151',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
          }}
        >
          <h3 style={{
            fontSize: '20px',
            fontWeight: 'bold',
            margin: '0 0 16px 0',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <BarChart3 style={{ 
              width: '20px', 
              height: '20px', 
              color: '#60a5fa' 
            }} />
            Performance Metrics
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {metrics.map((metric, index) => (
              <motion.div
                key={metric.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    {metric.name.includes("Server") && <Server style={{ width: '14px', height: '14px', color: '#9ca3af' }} />}
                    {metric.name.includes("Database") && <Database style={{ width: '14px', height: '14px', color: '#9ca3af' }} />}
                    {metric.name.includes("Memory") && <HardDrive style={{ width: '14px', height: '14px', color: '#9ca3af' }} />}
                    <span style={{
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#d1d5db'
                    }}>{metric.name}</span>
                  </div>
                  <span style={{
                    fontSize: '14px',
                    fontWeight: 'bold',
                    color: '#ffffff'
                  }}>{metric.value}</span>
                </div>
                
                <div style={{
                  width: '100%',
                  height: '8px',
                  backgroundColor: '#1f2937',
                  borderRadius: '4px'
                }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${metric.percentage}%` }}
                    transition={{ duration: 1, delay: index * 0.2 + 0.5 }}
                    style={{
                      height: '100%',
                      background: `linear-gradient(90deg, #${metric.color === 'green' ? '10b981' : metric.color === 'blue' ? '#3b82f6' : '#8b5cf6'} 0%, #${metric.color === 'green' ? '#059669' : metric.color === 'blue' ? '#1d4ed8' : '#7c3aed'} 100%)`,
                      borderRadius: '4px'
                    }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
