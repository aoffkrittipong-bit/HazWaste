import { useNavigate } from 'react-router';
import { ArrowLeft, TrendingUp, TrendingDown, Package, Weight, MapPin } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { wasteStatistics, wasteTypeInfo, dropOffLocations, pickupRequests } from '../lib/data';

export default function Statistics() {
  const navigate = useNavigate();

  // Prepare chart data
  const barChartData = wasteStatistics.map(stat => ({
    name: wasteTypeInfo[stat.type].name,
    count: stat.count,
    weight: stat.weight,
    color: wasteTypeInfo[stat.type].color,
  }));

  const pieChartData = wasteStatistics.map(stat => ({
    name: wasteTypeInfo[stat.type].name,
    value: stat.count,
    color: wasteTypeInfo[stat.type].color,
  }));

  // Monthly trend data (mock)
  const trendData = [
    { month: 'Jan', total: 820 },
    { month: 'Feb', total: 950 },
    { month: 'Mar', total: 1100 },
    { month: 'Apr', total: 980 },
    { month: 'May', total: 1250 },
    { month: 'Jun', total: 1086 },
  ];

  const totalCollections = wasteStatistics.reduce((sum, stat) => sum + stat.count, 0);
  const totalWeight = wasteStatistics.reduce((sum, stat) => sum + stat.weight, 0);
  const avgTrend = wasteStatistics.reduce((sum, stat) => sum + stat.trend, 0) / wasteStatistics.length;

  // Location capacity analysis
  const avgCapacity = dropOffLocations.reduce((sum, loc) => sum + loc.capacity, 0) / dropOffLocations.length;
  const nearFullLocations = dropOffLocations.filter(loc => loc.capacity > 70).length;

  // Pickup analysis
  const pendingPickups = pickupRequests.filter(r => r.status === 'pending').length;
  const highUrgency = pickupRequests.filter(r => r.urgency === 'high').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
      {/* Header */}
      <div className="bg-purple-600 text-white p-6 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/')}
            className="text-white hover:bg-purple-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl mb-2">Waste Management Statistics</h1>
          <p className="text-purple-100">Analytics and insights on hazardous waste collection</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Key Metrics */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-2">
                <Package className="w-4 h-4" />
                Total Collections
              </CardDescription>
              <CardTitle className="text-3xl text-purple-600">{totalCollections.toLocaleString()}</CardTitle>
              <div className="flex items-center gap-1 text-sm">
                {avgTrend > 0 ? (
                  <>
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <span className="text-green-600">+{avgTrend.toFixed(1)}%</span>
                  </>
                ) : (
                  <>
                    <TrendingDown className="w-4 h-4 text-red-600" />
                    <span className="text-red-600">{avgTrend.toFixed(1)}%</span>
                  </>
                )}
                <span className="text-slate-500">vs last month</span>
              </div>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-2">
                <Weight className="w-4 h-4" />
                Total Weight
              </CardDescription>
              <CardTitle className="text-3xl text-blue-600">{(totalWeight / 1000).toFixed(1)}t</CardTitle>
              <div className="text-sm text-slate-500">
                {totalWeight.toLocaleString()} kg collected
              </div>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Active Locations
              </CardDescription>
              <CardTitle className="text-3xl text-green-600">{dropOffLocations.length}</CardTitle>
              <div className="text-sm text-slate-500">
                {nearFullLocations} near capacity
              </div>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Pending Pickups</CardDescription>
              <CardTitle className="text-3xl text-orange-600">{pendingPickups}</CardTitle>
              <div className="text-sm text-red-600">
                {highUrgency} high priority
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Bar Chart - Collections by Type */}
          <Card>
            <CardHeader>
              <CardTitle>Collections by Waste Type</CardTitle>
              <CardDescription>Total items collected per category</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} fontSize={12} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8b5cf6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Pie Chart - Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Waste Type Distribution</CardTitle>
              <CardDescription>Percentage breakdown by category</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Trend Line Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Collection Trends</CardTitle>
            <CardDescription>Monthly collection volume over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="total" stroke="#8b5cf6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Detailed Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Detailed Waste Type Statistics</CardTitle>
            <CardDescription>Individual category performance and trends</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {wasteStatistics.map((stat) => {
                const info = wasteTypeInfo[stat.type];
                return (
                  <div key={stat.type} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-10 h-10 rounded-full flex items-center justify-center text-2xl"
                          style={{ backgroundColor: `${info.color}20` }}
                        >
                          {info.icon}
                        </div>
                        <div>
                          <h3 className="font-semibold">{info.name}</h3>
                          <p className="text-sm text-slate-500">{stat.count} items • {stat.weight}kg</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={`${
                          stat.trend > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {stat.trend > 0 ? '+' : ''}{stat.trend}%
                        </Badge>
                      </div>
                    </div>
                    <Progress 
                      value={(stat.count / totalCollections) * 100} 
                      className="h-2"
                      style={{ 
                        // @ts-ignore
                        '--progress-background': info.color 
                      }}
                    />
                    <p className="text-xs text-slate-500 mt-2">
                      {((stat.count / totalCollections) * 100).toFixed(1)}% of total collections
                    </p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Location Capacity Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Drop-off Location Capacity</CardTitle>
            <CardDescription>Current capacity status across all locations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {dropOffLocations.map((location) => (
                <div key={location.id} className="border rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-sm">{location.name}</h4>
                    <Badge className={`${
                      location.capacity < 30 ? 'bg-green-100 text-green-700' :
                      location.capacity < 70 ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {location.capacity}%
                    </Badge>
                  </div>
                  <Progress value={location.capacity} className="h-2" />
                  <p className="text-xs text-slate-500 mt-1">
                    {location.acceptedTypes.length} waste types accepted
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-4 p-4 bg-slate-100 rounded-lg">
              <p className="text-sm">
                <strong>Average Capacity:</strong> {avgCapacity.toFixed(1)}%
              </p>
              <p className="text-sm text-slate-600 mt-1">
                {nearFullLocations} location{nearFullLocations !== 1 ? 's' : ''} require{nearFullLocations === 1 ? 's' : ''} attention (over 70% capacity)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <Button onClick={() => navigate('/map')} className="bg-blue-600 hover:bg-blue-700">
            <MapPin className="w-4 h-4 mr-2" />
            View Map
          </Button>
          <Button onClick={() => navigate('/user')} variant="outline">
            User Dashboard
          </Button>
          <Button onClick={() => navigate('/truck')} variant="outline">
            Collector Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
