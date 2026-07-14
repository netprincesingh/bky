import React from 'react';
import { 
  BookOpen, 
  Users, 
  Database, 
  CheckCircle,
  TrendingUp,
  Activity
} from 'lucide-react';
import './DashboardScreen.css';

const DashboardScreen: React.FC = () => {
  return (
    <div className="dash-page">
      <div className="dash-header">
        <h1 className="dash-title">Admin Dashboard</h1>
        <p className="dash-subtitle">Overview, analytics, and recent activity across your platform.</p>
      </div>

      <div className="dash-divider" />

      {/* ─── Top Row: KPI Cards ─── */}
      <div className="dash-kpi-grid">
        
        {/* Card 1: Total Books */}
        <div className="dash-kpi-card">
          <div className="kpi-header">
            <div className="kpi-icon-wrap">
              <BookOpen size={18} className="kpi-icon" />
            </div>
            <span className="kpi-title">Total Books</span>
          </div>
          <div className="kpi-body">
            <span className="kpi-value">14</span>
            <span className="kpi-growth pos"><TrendingUp size={12} /> +2 this week</span>
          </div>
        </div>

        {/* Card 2: Active Authors */}
        <div className="dash-kpi-card">
          <div className="kpi-header">
            <div className="kpi-icon-wrap">
              <Users size={18} className="kpi-icon" />
            </div>
            <span className="kpi-title">Active Authors</span>
          </div>
          <div className="kpi-body">
            <span className="kpi-value">28</span>
            <div className="kpi-avatar-stack">
              <div className="kpi-avatar" style={{ backgroundImage: 'url("https://i.pravatar.cc/100?img=1")' }} />
              <div className="kpi-avatar" style={{ backgroundImage: 'url("https://i.pravatar.cc/100?img=2")' }} />
              <div className="kpi-avatar" style={{ backgroundImage: 'url("https://i.pravatar.cc/100?img=3")' }} />
              <div className="kpi-avatar-more">+5</div>
            </div>
          </div>
        </div>

        {/* Card 3: Total Nodes/Shlokas */}
        <div className="dash-kpi-card">
          <div className="kpi-header">
            <div className="kpi-icon-wrap">
              <Database size={18} className="kpi-icon" />
            </div>
            <span className="kpi-title">Total Nodes/Shlokas</span>
          </div>
          <div className="kpi-body">
            <span className="kpi-value">1,405</span>
            <span className="kpi-growth neutral">Steady</span>
          </div>
        </div>

        {/* Card 4: Engagement (Progress Ring) */}
        <div className="dash-kpi-card">
          <div className="kpi-header">
            <div className="kpi-icon-wrap">
              <CheckCircle size={18} className="kpi-icon" />
            </div>
            <span className="kpi-title">Content Chunks Verified</span>
          </div>
          <div className="kpi-body kpi-body-row">
            <span className="kpi-value">84%</span>
            <div className="kpi-ring-wrapper">
              <svg viewBox="0 0 36 36" className="kpi-circular-chart">
                <path className="circle-bg"
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path className="circle-fill"
                  strokeDasharray="84, 100"
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Middle Row: Visual Analytics ─── */}
      <div className="dash-charts-row">
        
        {/* Left Chart (70%): Area Line Chart */}
        <div className="dash-chart-card main-chart">
          <div className="chart-card-header">
            <h3 className="chart-title">Weekly Content Consumption</h3>
            <span className="chart-subtitle">Reading & Audio streams (Last 7 Days)</span>
          </div>
          <div className="chart-area-container">
            <svg viewBox="0 0 800 200" preserveAspectRatio="none" className="area-svg">
              <defs>
                <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#c084fc" />
                  <stop offset="50%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
              </defs>
              {/* Fake grid lines */}
              <line x1="0" y1="50" x2="800" y2="50" stroke="rgba(255,255,255,0.05)" />
              <line x1="0" y1="100" x2="800" y2="100" stroke="rgba(255,255,255,0.05)" />
              <line x1="0" y1="150" x2="800" y2="150" stroke="rgba(255,255,255,0.05)" />
              {/* Data Path: 8 points */}
              <path 
                d="M 0 160 C 100 160, 100 120, 200 140 C 300 160, 300 80, 400 90 C 500 100, 500 50, 600 40 C 700 30, 750 60, 800 50 L 800 200 L 0 200 Z" 
                fill="url(#areaGradient)" 
              />
              <path 
                d="M 0 160 C 100 160, 100 120, 200 140 C 300 160, 300 80, 400 90 C 500 100, 500 50, 600 40 C 700 30, 750 60, 800 50" 
                fill="none" 
                stroke="url(#lineGradient)" 
                strokeWidth="4" 
                strokeLinecap="round"
              />
            </svg>
            <div className="chart-x-axis">
              <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
            </div>
          </div>
        </div>

        {/* Right Chart (30%): Doughnut Chart */}
        <div className="dash-chart-card side-chart">
          <div className="chart-card-header">
            <h3 className="chart-title">Content Distribution</h3>
            <span className="chart-subtitle">By Category</span>
          </div>
          <div className="chart-doughnut-container">
            <svg viewBox="0 0 36 36" className="doughnut-svg">
              {/* Mythology: 35% */}
              <path className="donut-segment color-1" strokeDasharray="35 65" strokeDashoffset="25" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              {/* Philosophy: 30% */}
              <path className="donut-segment color-2" strokeDasharray="30 70" strokeDashoffset="-10" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              {/* Verses: 20% */}
              <path className="donut-segment color-3" strokeDasharray="20 80" strokeDashoffset="-40" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              {/* Commentary: 15% */}
              <path className="donut-segment color-4" strokeDasharray="15 85" strokeDashoffset="-60" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            </svg>
            <div className="donut-center-text">14K<br/><span style={{fontSize:'0.3rem', fontWeight:'normal'}}>Total</span></div>
          </div>
          <div className="donut-legend">
            <div className="legend-item"><span className="dot color-1"></span> Mythology (35%)</div>
            <div className="legend-item"><span className="dot color-2"></span> Philosophy (30%)</div>
            <div className="legend-item"><span className="dot color-3"></span> Verses (20%)</div>
            <div className="legend-item"><span className="dot color-4"></span> Commentary (15%)</div>
          </div>
        </div>

      </div>

      {/* ─── Bottom Row: Recent Activity ─── */}
      <div className="dash-activity-section">
        <div className="activity-header">
          <Activity size={20} className="activity-icon" />
          <h3 className="activity-title">Recent Updates</h3>
        </div>
        
        <div className="activity-list">
          
          <div className="activity-row">
            <div className="activity-info">
              <span className="activity-time">Just now</span>
              <p className="activity-desc">Chapter 4 added to <strong>Bhagavad Gita</strong> by Admin</p>
            </div>
            <span className="activity-badge badge-success">Success</span>
          </div>

          <div className="activity-row">
            <div className="activity-info">
              <span className="activity-time">2 hours ago</span>
              <p className="activity-desc">New Biography updated for <strong>Ved Vyasa</strong></p>
            </div>
            <span className="activity-badge badge-review">Pending Review</span>
          </div>

          <div className="activity-row">
            <div className="activity-info">
              <span className="activity-time">Yesterday</span>
              <p className="activity-desc">3 new <strong>Articles</strong> published to the live feed</p>
            </div>
            <span className="activity-badge badge-success">Success</span>
          </div>

        </div>
      </div>

    </div>
  );
};

export default DashboardScreen;
