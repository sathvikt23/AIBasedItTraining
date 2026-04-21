import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Code2,
  Brain,
  Flame,
  TrendingUp,
  Activity,
  Target,
  BarChart3,
  BookOpen,
} from 'lucide-react';

// ── Data ─────────────────────────────────────
const dsaTopics = [
  { label: "Arrays",       score: 91 },
  { label: "Linked lists", score: 78 },
  { label: "Trees",        score: 62 },
  { label: "Graphs",       score: 45 },
  { label: "DP",           score: 38 },
  { label: "Heaps",        score: 55 },
  { label: "Sorting",      score: 84 },
];

const paceData = [
  { label: "Arrays",  actual: 90, target: 85 },
  { label: "Trees",   actual: 60, target: 80 },
  { label: "DP",      actual: 35, target: 70 },
  { label: "Graphs",  actual: 45, target: 65 },
  { label: "Sorting", actual: 82, target: 75 },
];

const activities = [
  { text: "Solved 3 DP problems",       topic: "DP",     time: "2h ago",     color: "purple" },
  { text: "Completed Trees quiz — 72%", topic: "Trees",  time: "Yesterday",  color: "green"  },
  { text: "Watched Graphs lesson",      topic: "Graphs", time: "2 days ago", color: "blue"   },
  { text: "Solved 5 Array problems",    topic: "Arrays", time: "3 days ago", color: "blue"   },
];

const weakAreas = [
  { topic: "Dynamic programming",     score: 38, tip: "Review memoization patterns"  },
  { topic: "Graph traversal",         score: 45, tip: "Practice BFS / DFS templates" },
  { topic: "Heaps & priority queues", score: 55, tip: "Try 5 heap problems"          },
];

const streakDays = [
  1,1,1,0,1,1,1,
  1,0,1,1,1,0,1,
  0,1,1,0,1,1,1,
  1,1,1,0,0,1,1,
  1,1,1,1,1,0,0,
];

const statsCards = [
  { title: "Problems solved", value: "248", change: "+12 this week",     changeType: "positive", icon: Code2,  color: "green"  },
  { title: "Avg quiz score",  value: "76%", change: "+4% vs last month", changeType: "positive", icon: Brain,  color: "blue"   },
  { title: "Pace vs target",  value: "83%", change: "3 topics behind",   changeType: "negative", icon: Target, color: "purple" },
  { title: "Day streak",      value: "14",  change: "Personal best!",    changeType: "positive", icon: Flame,  color: "green"  },
];

// ── Helpers ───────────────────────────────────
const colorForScore = (s) => s >= 75 ? '#10b981' : s >= 50 ? '#3b82f6' : '#ef4444';

const topicColor = { purple: '#8b5cf6', green: '#10b981', blue: '#3b82f6' };
const iconColor   = { green: '#10b981', blue: '#3b82f6',  purple: '#8b5cf6' };

// Matches original card style exactly
const cardStyle = {
  background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
  borderRadius: '16px',
  padding: '24px',
  border: '1px solid #374151',
  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
};

const containerVariants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden:  { y: 20, opacity: 0 },
  visible: { y: 0,  opacity: 1, transition: { type: 'spring', stiffness: 100 } },
};

// ── Chart.js — Growth line ────────────────────
function GrowthChart() {
  const ref = useRef();
  useEffect(() => {
    if (!window.Chart) return;
    const chart = new window.Chart(ref.current, {
      type: 'line',
      data: {
        labels: ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'],
        datasets: [{
          data: [18, 34, 52, 89, 145, 248],
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59,130,246,0.12)',
          fill: true, tension: 0.4, pointRadius: 3,
          pointBackgroundColor: '#3b82f6',
        }],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { color: 'rgba(255,255,255,0.06)' }, ticks: { color: '#9ca3af', font: { size: 11 } } },
          y: { grid: { color: 'rgba(255,255,255,0.06)' }, ticks: { color: '#9ca3af', font: { size: 11 } } },
        },
      },
    });
    return () => chart.destroy();
  }, []);
  return <div style={{ position: 'relative', height: 150 }}><canvas ref={ref} /></div>;
}

// ── Chart.js — Difficulty doughnut ───────────
function DiffChart() {
  const ref = useRef();
  useEffect(() => {
    if (!window.Chart) return;
    const chart = new window.Chart(ref.current, {
      type: 'doughnut',
      data: {
        labels: ['Easy', 'Medium', 'Hard'],
        datasets: [{ data: [112, 98, 38], backgroundColor: ['#10b981', '#3b82f6', '#ef4444'], borderWidth: 0 }],
      },
      options: {
        responsive: true, maintainAspectRatio: false, cutout: '68%',
        plugins: {
          legend: {
            display: true, position: 'bottom',
            labels: { font: { size: 11 }, color: '#9ca3af', boxWidth: 10, padding: 10 },
          },
        },
      },
    });
    return () => chart.destroy();
  }, []);
  return <div style={{ position: 'relative', height: 150 }}><canvas ref={ref} /></div>;
}

// ── Main ──────────────────────────────────────
export default function DashboardLayout({ metadata }) {
  useEffect(() => {
    if (window.Chart) return;
    const s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js';
    document.head.appendChild(s);
  }, []);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      style={{ width: '100%' }}
    >

      {/* ── Header — same gradient as original ── */}
      <motion.div
        variants={itemVariants}
        style={{
          background: 'linear-gradient(135deg, #1e40af 0%, #374151 50%, #111827 100%)',
          borderRadius: '16px',
          padding: '32px',
          marginBottom: '32px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
        }}
      >
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', margin: 0, color: '#ffffff', textShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
          {metadata?.title || "Learning Dashboard"}
        </h1>
        <p style={{ fontSize: '16px', color: '#d1d5db', marginTop: '8px' }}>
          Track your DSA progress, quiz scores and daily pace
        </p>
      </motion.div>

      {/* ── Stat cards ── */}
      <motion.div variants={containerVariants} style={{ marginBottom: '32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px' }}>
          {statsCards.map((stat) => (
            <motion.div
              key={stat.title}
              variants={itemVariants}
              whileHover={{ scale: 1.02, boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2), 0 10px 25px -5px rgba(0,0,0,0.08)' }}
              style={cardStyle}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                  style={{
                    width: '44px', height: '44px',
                    background: `${iconColor[stat.color]}22`,
                    borderRadius: '12px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                  }}
                >
                  <stat.icon style={{ width: '20px', height: '20px', color: iconColor[stat.color] }} />
                </motion.div>
                <span style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280' }}>{stat.title}</span>
              </div>
              <p style={{ fontSize: '28px', fontWeight: 'bold', margin: '0 0 8px', color: '#ffffff' }}>
                {stat.value}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <TrendingUp style={{ width: '14px', height: '14px', color: stat.changeType === 'positive' ? '#10b981' : '#ef4444' }} />
                <span style={{ fontSize: '13px', fontWeight: '500', color: stat.changeType === 'positive' ? '#10b981' : '#ef4444' }}>
                  {stat.change}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ── DSA mastery + Pace ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '32px', marginBottom: '32px' }}>

        <motion.div variants={itemVariants} style={cardStyle}>
          <h3 style={{ fontSize: '20px', fontWeight: 'bold', margin: '0 0 16px', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <BarChart3 style={{ width: '20px', height: '20px', color: '#60a5fa' }} />
            DSA topic mastery
          </h3>
          {dsaTopics.map((t) => (
            <div key={t.label} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', fontSize: '13px' }}>
              <span style={{ width: '88px', color: '#d1d5db', flexShrink: 0 }}>{t.label}</span>
              <div style={{ flex: 1, height: '8px', background: '#374151', borderRadius: '4px', overflow: 'hidden' }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${t.score}%` }}
                  transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
                  style={{ height: '100%', borderRadius: '4px', background: colorForScore(t.score) }}
                />
              </div>
              <span style={{ width: '34px', textAlign: 'right', color: '#9ca3af', flexShrink: 0 }}>{t.score}%</span>
            </div>
          ))}
        </motion.div>

        <motion.div variants={itemVariants} style={cardStyle}>
          <h3 style={{ fontSize: '20px', fontWeight: 'bold', margin: '0 0 16px', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Target style={{ width: '20px', height: '20px', color: '#60a5fa' }} />
            Actual speed vs self-pacing target
          </h3>
          {paceData.map((t) => (
            <div key={t.label} style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '13px', color: '#d1d5db', marginBottom: '5px' }}>{t.label}</div>
              <div style={{ position: 'relative', height: '12px', background: '#374151', borderRadius: '6px', overflow: 'visible' }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${t.actual}%` }}
                  transition={{ duration: 0.8 }}
                  style={{ height: '100%', borderRadius: '6px', background: '#3b82f6', opacity: 0.85 }}
                />
                <div style={{
                  position: 'absolute', top: '-3px', bottom: '-3px',
                  left: `${Math.min(t.target, 100)}%`,
                  width: '2px', background: '#ef4444',
                  transform: 'translateX(-50%)', borderRadius: '2px',
                }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#6b7280', marginTop: '3px' }}>
                <span>Actual: {t.actual}%</span><span>Target: {t.target}%</span>
              </div>
            </div>
          ))}
          <div style={{ display: 'flex', gap: '16px', marginTop: '4px', fontSize: '12px', color: '#6b7280' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#3b82f6', display: 'inline-block' }} />Actual
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '10px', height: '2px', background: '#ef4444', display: 'inline-block' }} />Target
            </span>
          </div>
        </motion.div>
      </div>

      {/* ── Growth + Difficulty + Streak ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px', marginBottom: '32px' }}>

        <motion.div variants={itemVariants} style={cardStyle}>
          <h3 style={{ fontSize: '20px', fontWeight: 'bold', margin: '0 0 16px', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <TrendingUp style={{ width: '20px', height: '20px', color: '#60a5fa' }} />
            Monthly growth
          </h3>
          <GrowthChart />
        </motion.div>

        <motion.div variants={itemVariants} style={cardStyle}>
          <h3 style={{ fontSize: '20px', fontWeight: 'bold', margin: '0 0 16px', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Code2 style={{ width: '20px', height: '20px', color: '#60a5fa' }} />
            Problem difficulty split
          </h3>
          <DiffChart />
        </motion.div>

        <motion.div variants={itemVariants} style={cardStyle}>
          <h3 style={{ fontSize: '20px', fontWeight: 'bold', margin: '0 0 16px', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Flame style={{ width: '20px', height: '20px', color: '#60a5fa' }} />
            Learning streak — last 5 weeks
          </h3>
          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
            {streakDays.map((d, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.01 }}
                style={{
                  width: '14px', height: '14px', borderRadius: '3px',
                  background: d ? '#10b981' : '#1f2937',
                  border: '1px solid #374151',
                }}
              />
            ))}
          </div>
          <div style={{ marginTop: '14px', fontSize: '12px', color: '#9ca3af' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />Studied
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#1f2937', border: '1px solid #374151', display: 'inline-block' }} />Missed
            </div>
            Best week: <span style={{ color: '#ffffff', fontWeight: '500' }}>7 days</span>
            &nbsp;·&nbsp;
            This week: <span style={{ color: '#ffffff', fontWeight: '500' }}>5 days</span>
          </div>
        </motion.div>
      </div>

      {/* ── Activity + Weak areas ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '32px' }}>

        <motion.div variants={itemVariants} style={cardStyle}>
          <h3 style={{ fontSize: '20px', fontWeight: 'bold', margin: '0 0 16px', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Activity style={{ width: '20px', height: '20px', color: '#60a5fa' }} />
            Recent activity
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {activities.map((a, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ x: 5 }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '16px',
                  padding: '16px',
                  background: 'rgba(255,255,255,0.05)',
                  borderRadius: '12px',
                  cursor: 'pointer',
                }}
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{ width: '8px', height: '8px', borderRadius: '50%', background: topicColor[a.color], flexShrink: 0 }}
                />
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '14px', fontWeight: '500', margin: 0, color: '#ffffff' }}>{a.text}</p>
                  <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>{a.time}</p>
                </div>
                <span style={{
                  fontSize: '11px', padding: '2px 8px', borderRadius: '99px',
                  background: `${topicColor[a.color]}22`, color: topicColor[a.color],
                  fontWeight: '500', flexShrink: 0,
                }}>{a.topic}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div variants={itemVariants} style={cardStyle}>
          <h3 style={{ fontSize: '20px', fontWeight: 'bold', margin: '0 0 16px', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <BookOpen style={{ width: '20px', height: '20px', color: '#60a5fa' }} />
            Weak areas to review
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {weakAreas.map((w, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                style={{
                  padding: '16px 0',
                  borderBottom: i < weakAreas.length - 1 ? '1px solid #374151' : 'none',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '14px', fontWeight: '500', color: '#ffffff' }}>{w.topic}</span>
                  <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#ef4444' }}>{w.score}%</span>
                </div>
                <div style={{ height: '8px', background: '#374151', borderRadius: '4px', overflow: 'hidden', marginBottom: '8px' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${w.score}%` }}
                    transition={{ duration: 0.8, delay: i * 0.15 }}
                    style={{ height: '100%', borderRadius: '4px', background: '#ef4444' }}
                  />
                </div>
                <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0 }}>{w.tip}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
}