import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  LineChart, Line, CartesianGrid, PieChart, Pie, Cell
} from 'recharts';

const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-2xl p-6 shadow-lg border border-gray-200 ${className}`}>
    {children}
  </div>
);

// Icons
const TrendingUpIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

const UsersIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
  </svg>
);

const DocumentIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const ClockIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export default function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState('7d'); // 7d, 30d, 90d
  const [loading, setLoading] = useState(true);

  // Mock data - In real app, yeh API se aayega
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalQueries: 0,
      activeUsers: 0,
      documentsAnalyzed: 0,
      avgResponseTime: 0
    },
    performanceData: [],
    usageTrend: [],
    caseDistribution: [],
    recentActivity: []
  });

  // Simulate data loading
  useEffect(() => {
    const loadDashboardData = () => {
      setLoading(true);
      
      // Simulate API call delay
      setTimeout(() => {
        const mockData = generateMockData(timeRange);
        setDashboardData(mockData);
        setLoading(false);
      }, 1000);
    };

    loadDashboardData();
  }, [timeRange]);

  // Mock data generator
  const generateMockData = (range) => {
    const baseQueries = range === '7d' ? 1842 : range === '30d' ? 7580 : 21500;
    const baseUsers = range === '7d' ? 247 : range === '30d' ? 890 : 2500;
    
    return {
      stats: {
        totalQueries: baseQueries,
        activeUsers: baseUsers,
        documentsAnalyzed: Math.floor(baseQueries * 0.35),
        avgResponseTime: 1.2
      },
      performanceData: [
        { metric: "Accuracy", value: 92 + Math.random() * 5 },
        { metric: "Response Time", value: 85 + Math.random() * 10 },
        { metric: "User Satisfaction", value: 95 + Math.random() * 3 },
        { metric: "Case Relevance", value: 88 + Math.random() * 7 }
      ],
      usageTrend: generateTrendData(range),
      caseDistribution: [
        { name: "Civil", value: 35, color: "#3B82F6" },
        { name: "Criminal", value: 25, color: "#10B981" },
        { name: "Corporate", value: 20, color: "#F59E0B" },
        { name: "Family", value: 15, color: "#EF4444" },
        { name: "Other", value: 5, color: "#8B5CF6" }
      ],
      recentActivity: [
        { 
          user: "Adv. Sharma", 
          action: "Contract Analysis", 
          time: "2 mins ago", 
          document: "Service Agreement.pdf" 
        },
        { 
          user: "Law Firm XYZ", 
          action: "Case Research", 
          time: "15 mins ago", 
          document: "Smith vs Jones" 
        },
        { 
          user: "Legal Dept", 
          action: "Document Review", 
          time: "1 hour ago", 
          document: "NDA Draft.docx" 
        },
        { 
          user: "Student", 
          action: "Legal Query", 
          time: "2 hours ago", 
          document: "IP Rights Question" 
        }
      ]
    };
  };

  const generateTrendData = (range) => {
    const days = range === '7d' ? 7 : range === '30d' ? 30 : 90;
    const data = [];
    
    for (let i = 0; i < days; i++) {
      data.push({
        day: `Day ${i + 1}`,
        queries: Math.floor(50 + Math.random() * 100),
        documents: Math.floor(15 + Math.random() * 30)
      });
    }
    
    return data;
  };

  // Stats Cards with loading animation
  const StatCard = ({ icon, title, value, change, changeType }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          {loading ? (
            <div className="h-8 w-20 bg-gray-200 rounded animate-pulse mt-2"></div>
          ) : (
            <p className="text-2xl font-bold text-gray-900 mt-1">{value.toLocaleString()}</p>
          )}
        </div>
        <div className="text-blue-600 bg-blue-100 p-3 rounded-xl">
          {icon}
        </div>
      </div>
      {change && (
        <div className={`flex items-center mt-3 text-sm ${
          changeType === 'positive' ? 'text-green-600' : 'text-red-600'
        }`}>
          <TrendingUpIcon />
          <span className="ml-1 font-medium">{change}</span>
          <span className="ml-1 text-gray-500">vs previous period</span>
        </div>
      )}
    </motion.div>
  );

  // Custom Tooltip for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="font-medium text-gray-900">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center mb-8"
      >
        <div>
          <h1 className="text-3xl font-bold text-white">Legal Analytics Dashboard</h1>
          <p className="text-blue-100 mt-2">Real-time insights into your legal research performance</p>
        </div>
        
        {/* Time Range Selector */}
        <div className="flex space-x-2 bg-white/10 backdrop-blur-sm rounded-xl p-1">
          {['7d', '30d', '90d'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                timeRange === range
                  ? 'bg-white text-blue-900 shadow-lg'
                  : 'text-white hover:bg-white/20'
              }`}
            >
              {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : '90 Days'}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={<DocumentIcon />}
          title="Total Legal Queries"
          value={dashboardData.stats.totalQueries}
          change="+12.5%"
          changeType="positive"
        />
        <StatCard
          icon={<UsersIcon />}
          title="Active Users"
          value={dashboardData.stats.activeUsers}
          change="+8.3%"
          changeType="positive"
        />
        <StatCard
          icon={<DocumentIcon />}
          title="Documents Analyzed"
          value={dashboardData.stats.documentsAnalyzed}
          change="+15.2%"
          changeType="positive"
        />
        <StatCard
          icon={<ClockIcon />}
          title="Avg Response Time"
          value={dashboardData.stats.avgResponseTime}
          suffix="s"
          change="-5.7%"
          changeType="positive"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Performance Metrics */}
        <Card>
          <h3 className="text-lg font-semibold mb-6 text-gray-800 flex items-center">
            <TrendingUpIcon />
            <span className="ml-2">AI Performance Metrics</span>
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dashboardData.performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="metric" 
                stroke="#6b7280" 
                fontSize={12}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis 
                stroke="#6b7280" 
                fontSize={12}
                domain={[0, 100]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="value" 
                fill="#3b82f6" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Usage Trend */}
        <Card>
          <h3 className="text-lg font-semibold mb-6 text-gray-800">Usage Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dashboardData.usageTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="day" 
                stroke="#6b7280" 
                fontSize={10}
              />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="queries" 
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 3 }}
                name="Legal Queries"
              />
              <Line 
                type="monotone" 
                dataKey="documents" 
                stroke="#10b981" 
                strokeWidth={2}
                dot={{ fill: '#10b981', strokeWidth: 2, r: 3 }}
                name="Documents"
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Case Distribution */}
        <Card>
          <h3 className="text-lg font-semibold mb-6 text-gray-800">Case Type Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={dashboardData.caseDistribution}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {dashboardData.caseDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            {dashboardData.caseDistribution.map((entry, index) => (
              <div key={entry.name} className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: entry.color }}
                ></div>
                <span className="text-xs text-gray-600">{entry.name} ({entry.value}%)</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <h3 className="text-lg font-semibold mb-6 text-gray-800">Recent Activity</h3>
          <div className="space-y-4">
            {dashboardData.recentActivity.map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200 hover:bg-blue-50 hover:border-blue-200 transition-all duration-200"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                    <UsersIcon />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{activity.user}</p>
                    <p className="text-sm text-gray-600">{activity.action}</p>
                    <p className="text-xs text-gray-500">{activity.document}</p>
                  </div>
                </div>
                <span className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full border">
                  {activity.time}
                </span>
              </motion.div>
            ))}
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white"
      >
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold mb-2">Need Detailed Reports?</h3>
            <p className="text-blue-100">Export comprehensive analytics and performance reports</p>
          </div>
          <button className="bg-white text-blue-900 px-6 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-colors">
            Export Reports
          </button>
        </div>
      </motion.div>
    </div>
  );
}