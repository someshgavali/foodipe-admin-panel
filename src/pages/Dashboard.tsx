import React, { useEffect, useMemo, useState } from "react";
import {
  Users,
  UtensilsCrossed,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Star,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getAllCountCanteen } from "../api/adminApi/canteen";

interface CanteenCounts {
  totalUsers?: number;
  totalCanteens?: number;
  totalMenuItems?: number;
  totalRevenue?: number;
  userCount?: number;
  menuCount?: number;
  canteenOrdersCount?: number;
  recentActivities?: any[];
  topMenuItems?: any[];
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [canteenCounts, setCanteenCounts] = useState<CanteenCounts>({});
  const [canteenId, setCanteenId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const readTokenFromLocalStorage = (): string | null => {
      try {
        const stored = localStorage.getItem("admin_token");
        if (!stored) return null;
        if (stored.startsWith("{") || stored.startsWith("[")) {
          const parsed = JSON.parse(stored);
          return parsed?.token ?? null;
        }
        return stored;
      } catch (error) {
        console.error("Failed to read token from localStorage", error);
        return null;
      }
    };

    const decodeJwtPayload = (token: string): any | null => {
      try {
        const base64Url = token.split(".")[1];
        if (!base64Url) return null;
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split("")
            .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
            .join("")
        );
        return JSON.parse(jsonPayload);
      } catch (error) {
        console.error("Failed to decode JWT", error);
        return null;
      }
    };
    if (user?.canteenId) {
      setCanteenId(String(user.canteenId));
      return;
    }

    const token = readTokenFromLocalStorage();
    if (token) {
      const payload = decodeJwtPayload(token);
      const idFromToken =
        payload?.canteenId ??
        payload?.canteenid ??
        payload?.userid ??
        payload?.id;
      if (idFromToken) {
        setCanteenId(String(idFromToken));
      } else {
        console.warn("Dashboard: no canteenId found in token payload");
      }
    }
  }, [user?.canteenId]);

  useEffect(() => {
    const loadCounts = async () => {
      try {
        if (canteenId) {
          setLoading(true);
          const canteenData = await getAllCountCanteen(canteenId);
          const container = Array.isArray(canteenData)
            ? canteenData
            : (canteenData as any)?.Data ??
              (canteenData as any)?.data ??
              canteenData;
          const normalized = Array.isArray(container)
            ? container[0]
            : container;
          const safeCounts =
            normalized && typeof normalized === "object" ? normalized : {};
          setCanteenCounts(safeCounts as any);
        } else {
          return;
        }
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
        setCanteenCounts({});
      } finally {
        setLoading(false);
      }
    };
    loadCounts();
  }, [canteenId]);

  const stats = useMemo(
    () => [
      {
        title: "Total Users",
        value: loading ? "..." : String(canteenCounts.userCount || 0),
        change: "+12.5%",
        changeType: "increase" as const,
        icon: Users,
        color: "blue",
      },
      {
        title: "Menu Items",
        value: loading ? "..." : String(canteenCounts.menuCount || 0),
        change: "+8.2%",
        changeType: "increase" as const,
        icon: UtensilsCrossed,
        color: "purple",
      },
      {
        title: "Total Orders",
        value: loading
          ? "..."
          : canteenCounts.canteenOrdersCount != null
          ? String(canteenCounts.canteenOrdersCount)
          : "$0",
        change: "+15.3%",
        changeType: "increase" as const,
        icon: DollarSign,
        color: "amber",
      },
    ],
    [canteenCounts, loading]
  );

  const recentActivities = canteenCounts.recentActivities || [
    {
      id: 1,
      action: "New user registered",
      user: "John Smith",
      time: "2 minutes ago",
    },
    {
      id: 2,
      action: "Menu item added",
      user: "Sarah Wilson",
      time: "15 minutes ago",
    },
    {
      id: 3,
      action: "Canteen updated",
      user: "Mike Johnson",
      time: "1 hour ago",
    },
    {
      id: 4,
      action: "Category created",
      user: "Admin User",
      time: "2 hours ago",
    },
    { id: 5, action: "Order completed", user: "Jane Doe", time: "3 hours ago" },
  ];

  const topMenuItems = canteenCounts.topMenuItems || [
    { name: "Chicken Fried Rice", orders: 247, rating: 4.8 },
    { name: "Beef Noodle Soup", orders: 189, rating: 4.7 },
    { name: "Margherita Pizza", orders: 156, rating: 4.6 },
    { name: "Caesar Salad", orders: 134, rating: 4.5 },
    { name: "Chocolate Cake", orders: 98, rating: 4.9 },
  ];

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: "bg-blue-500 text-blue-600 bg-blue-50",
      green: "bg-green-500 text-green-600 bg-green-50",
      purple: "bg-purple-500 text-purple-600 bg-purple-50",
      amber: "bg-amber-500 text-amber-600 bg-amber-50",
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">
          Welcome back! Here's what's happening with your Foodipe admin panel.
        </p>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-2 text-gray-600">Loading dashboard data...</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const colors = getColorClasses(stat.color).split(" ");

          return (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-12 h-12 ${colors[2]} rounded-lg flex items-center justify-center`}
                >
                  <Icon className={`w-6 h-6 ${colors[1]}`} />
                </div>
                <span
                  className={`text-sm font-medium px-2 py-1 rounded-full ${
                    stat.changeType === "increase"
                      ? "text-green-700 bg-green-100"
                      : "text-red-700 bg-red-100"
                  }`}
                >
                  {stat.change}
                </span>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </p>
                <p className="text-gray-600 text-sm">{stat.title}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Recent Activities
            </h2>
            <TrendingUp className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div
                key={activity.id || index}
                className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {activity.action}
                  </p>
                  <p className="text-sm text-gray-600">by {activity.user}</p>
                  <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Top Menu Items
            </h2>
            <ShoppingCart className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {topMenuItems.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{item.name}</p>
                  <p className="text-sm text-gray-600">{item.orders} orders</p>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-amber-400 fill-current" />
                  <span className="text-sm font-medium text-gray-700">
                    {item.rating}
                  </span>
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
