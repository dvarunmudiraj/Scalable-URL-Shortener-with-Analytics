
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import { Button } from '../components/ui/button';
import { ArrowLeft, Eye, Globe, Calendar, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { apiCall } from '../lib/api';
import { toast } from '../hooks/use-toast';

const Analytics: React.FC = () => {
  const { shortCode } = useParams();
  const [timeRange, setTimeRange] = useState('7d');
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch analytics data on component mount and when timeRange changes
  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!shortCode) return;
      
      setIsLoading(true);
      try {
        const response = await apiCall(`/analytics/${shortCode}?timeRange=${timeRange}`);
        setAnalyticsData(response);
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
        toast({
          title: "Error",
          description: "Failed to load analytics data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, [shortCode, timeRange]);

  // Default data structure for loading state
  const defaultData = {
    clicksData: [],
    locationData: [],
    deviceData: [
      { name: 'Desktop', value: 60, color: '#8B5CF6' },
      { name: 'Mobile', value: 35, color: '#3B82F6' },
      { name: 'Tablet', value: 5, color: '#06B6D4' },
    ],
    urlData: {
      originalUrl: '',
      shortUrl: `https://short.ly/${shortCode}`,
      totalClicks: 0,
      createdAt: new Date().toISOString()
    },
    recentActivity: []
  };

  const data = analyticsData || defaultData;

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link to="/dashboard">
              <Button variant="outline" className="glass glass-hover border-white/20 text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-white">Analytics</h1>
              <p className="text-gray-300 font-mono">{data.urlData.shortUrl}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {['7d', '30d', '90d'].map((range) => (
              <Button
                key={range}
                variant={timeRange === range ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeRange(range)}
                className={timeRange === range ? "bg-primary" : "glass glass-hover border-white/20 text-white"}
              >
                {range}
              </Button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-400">Loading analytics...</p>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="glass p-6 rounded-2xl neon-glow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Total Clicks</p>
                    <p className="text-3xl font-bold text-white">{data.urlData.totalClicks}</p>
                  </div>
                  <Eye className="w-8 h-8 text-purple-400" />
                </div>
              </div>

              <div className="glass p-6 rounded-2xl neon-glow-blue">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Avg. Daily Clicks</p>
                    <p className="text-3xl font-bold text-white">{data.avgDailyClicks || 0}</p>
                  </div>
                  <Calendar className="w-8 h-8 text-blue-400" />
                </div>
              </div>

              <div className="glass p-6 rounded-2xl neon-glow-cyan">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Top Country</p>
                    <p className="text-3xl font-bold text-white">{data.topCountry || 'N/A'}</p>
                  </div>
                  <Globe className="w-8 h-8 text-cyan-400" />
                </div>
              </div>

              <div className="glass p-6 rounded-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Growth Rate</p>
                    <p className="text-3xl font-bold text-green-400">{data.growthRate || '0%'}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-green-400" />
                </div>
              </div>
            </div>
          </>
        )}

        {/* Charts - Only show when not loading */}
        {!isLoading && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Clicks Over Time */}
              <div className="glass p-6 rounded-2xl neon-glow">
                <h3 className="text-xl font-bold text-white mb-6">Clicks Over Time</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={data.clicksData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                    <XAxis dataKey="date" stroke="#ffffff60" />
                    <YAxis stroke="#ffffff60" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1a1a2e', 
                        border: '1px solid #ffffff20',
                        borderRadius: '8px'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="clicks" 
                      stroke="#8B5CF6" 
                      strokeWidth={3}
                      dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Device Types */}
              <div className="glass p-6 rounded-2xl neon-glow-blue">
                <h3 className="text-xl font-bold text-white mb-6">Device Types</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={data.deviceData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {data.deviceData.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Location Analytics */}
            <div className="glass p-6 rounded-2xl neon-glow-cyan">
              <h3 className="text-xl font-bold text-white mb-6">Clicks by Location</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.locationData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                  <XAxis dataKey="country" stroke="#ffffff60" />
                  <YAxis stroke="#ffffff60" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1a1a2e', 
                      border: '1px solid #ffffff20',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="clicks" fill="#06B6D4" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Real-time Activity */}
            <div className="mt-8 glass p-6 rounded-2xl">
              <h3 className="text-xl font-bold text-white mb-6">Recent Activity</h3>
              <div className="space-y-4">
                {(data.recentActivity || []).length > 0 ? (
                  data.recentActivity.map((activity: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <div>
                          <p className="text-white">{activity.location}</p>
                          <p className="text-sm text-gray-400">{activity.device}</p>
                        </div>
                      </div>
                      <span className="text-sm text-gray-400">{activity.time}</span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-400">No recent activity</p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Analytics;