import React from 'react';
import { Users, Building2, Folder, UtensilsCrossed, TrendingUp, DollarSign, ShoppingCart, Star } from 'lucide-react';

const Dashboard: React.FC = () => {
  const stats = [
    {
      title: 'Total Users',
      value: '2,847',
      change: '+12.5%',
      changeType: 'increase' as const,
      icon: Users,
      color: 'blue'
    },
    {
      title: 'Active Canteens',
      value: '24',
      change: '+2',
      changeType: 'increase' as const,
      icon: Building2,
      color: 'green'
    },
    {
      title: 'Menu Items',
      value: '1,432',
      change: '+8.2%',
      changeType: 'increase' as const,
      icon: UtensilsCrossed,
      color: 'purple'
    },
    {
      title: 'Total Revenue',
      value: '$45,678',
      change: '+15.3%',
      changeType: 'increase' as const,
      icon: DollarSign,
      color: 'amber'
    }
  ];

  const recentActivities = [
    { id: 1, action: 'New user registered', user: 'John Smith', time: '2 minutes ago' },
    { id: 2, action: 'Menu item added', user: 'Sarah Wilson', time: '15 minutes ago' },
    { id: 3, action: 'Canteen updated', user: 'Mike Johnson', time: '1 hour ago' },
    { id: 4, action: 'Category created', user: 'Admin User', time: '2 hours ago' },
    { id: 5, action: 'Order completed', user: 'Jane Doe', time: '3 hours ago' }
  ];

  const topMenuItems = [
    { name: 'Chicken Fried Rice', orders: 247, rating: 4.8 },
    { name: 'Beef Noodle Soup', orders: 189, rating: 4.7 },
    { name: 'Margherita Pizza', orders: 156, rating: 4.6 },
    { name: 'Caesar Salad', orders: 134, rating: 4.5 },
    { name: 'Chocolate Cake', orders: 98, rating: 4.9 }
  ];

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: 'bg-blue-500 text-blue-600 bg-blue-50',
      green: 'bg-green-500 text-green-600 bg-green-50',
      purple: 'bg-purple-500 text-purple-600 bg-purple-50',
      amber: 'bg-amber-500 text-amber-600 bg-amber-50'
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with your Foodipe admin panel.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const colors = getColorClasses(stat.color).split(' ');
          
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${colors[2]} rounded-lg flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${colors[1]}`} />
                </div>
                <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                  stat.changeType === 'increase' ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'
                }`}>
                  {stat.change}
                </span>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
                <p className="text-gray-600 text-sm">{stat.title}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Recent Activities</h2>
            <TrendingUp className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-sm text-gray-600">by {activity.user}</p>
                  <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Menu Items */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Top Menu Items</h2>
            <ShoppingCart className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {topMenuItems.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{item.name}</p>
                  <p className="text-sm text-gray-600">{item.orders} orders</p>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-amber-400 fill-current" />
                  <span className="text-sm font-medium text-gray-700">{item.rating}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;