import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  Building2,
  Folder,
  FolderOpen,
  UtensilsCrossed,
  LogOut,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const { user, logout, hasPermission, isSuperAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const userIsSuperAdmin = isSuperAdmin();
  const userIsCompanyAdmin = user?.role?.name === 'CompanyAdmin';

  const baseItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', visible: true },

    // Users - visible to SuperAdmin OR CompanyAdmin with user permissions
    {
      path: '/dashboard/users',
      icon: Users,
      label: 'Users',
      visible: userIsSuperAdmin ||
        (userIsCompanyAdmin && hasPermission('Company Service', '/user/getAllUsers', 'GET'))
    },

    // Companies - visible only to SuperAdmin
    {
      path: '/dashboard/company',
      icon: Users,
      label: 'Companies',
      visible: userIsSuperAdmin
    },

    // Canteens - visible to SuperAdmin OR CompanyAdmin with canteen permissions
    {
      path: '/dashboard/canteens',
      icon: Building2,
      label: 'Canteens',
      visible: userIsSuperAdmin ||
        (userIsCompanyAdmin && hasPermission('Company Service', '/canteen/getAllCanteens', 'GET'))
    },

    // Categories - visible to users with appropriate permissions
    {
      path: '/dashboard/categories',
      icon: Folder,
      label: 'Categories',
      visible: hasPermission('/canteenCategories/getCanteensCategories', 'GET')
    },

    // Subcategories - visible to users with appropriate permissions
    {
      path: '/dashboard/subcategories',
      icon: FolderOpen,
      label: 'Subcategories',
      visible: hasPermission('/canteenSubCategories/getSubCanteensCategories', 'GET')
    },

    // Menu Items - visible to users with appropriate permissions
    {
      path: '/dashboard/menu-items',
      icon: UtensilsCrossed,
      label: 'Menu Items',
      visible: hasPermission()
    },
  ];
  // const baseItems = [
  //   { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', visible: true },
  //   // Keep superadmin-only items intact
  //   { path: '/dashboard/users', icon: Users, label: 'Users', visible: hasPermission('UserService', '/user/getAllUsers', 'GET') || userIsSuperAdmin },
  //   { path: '/dashboard/company', icon: Users, label: 'Companies', visible: userIsSuperAdmin },
  //   // Canteen-scoped items based on Canteen Service permissions
  //   { path: '/dashboard/canteens', icon: Building2, label: 'Canteens', visible: userIsSuperAdmin },
  //   { path: '/dashboard/categories', icon: Folder, label: 'Categories', visible: hasPermission('Canteen Service', '/canteenCategories/getCanteensCategories', 'GET') },
  //   { path: '/dashboard/subcategories', icon: FolderOpen, label: 'Subcategories', visible: hasPermission('Canteen Service', '/canteenSubCategories/getSubCanteensCategories', 'GET') },
  //   { path: '/dashboard/menu-items', icon: UtensilsCrossed, label: 'Menu Items', visible: hasPermission('Canteen Service') },
  // ];

  // Filter menu items based on visibility
  const menuItems = baseItems.filter(item => item.visible);

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-20"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed left-0 top-0 h-screen bg-white border-r border-gray-200 transition-transform duration-300 z-30
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:z-0 lg:h-screen
        w-64 flex flex-col
      `}>
        {/* Header - Fixed at top */}
        <div className="flex-shrink-0 p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <UtensilsCrossed className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Foodipe</h1>
              <p className="text-sm text-gray-500">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Navigation - Scrollable middle section */}
        <nav className="flex-1 overflow-y-auto p-4">
          <p className="px-4 pb-2 text-xs font-semibold tracking-wider text-gray-400 uppercase">Navigation</p>
          <div className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  end={item.path === '/dashboard'}
                  className={({ isActive }) => `
                    group relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                    ${isActive
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm'
                      : 'text-gray-700 hover:bg-gray-100'
                    }
                  `}
                >
                  {({ isActive }) => (
                    <>
                      <span className={`flex h-8 w-8 items-center justify-center rounded-lg border ${isActive
                        ? 'border-white/30 bg-white/10 text-white'
                        : 'border-gray-200 bg-white text-gray-600 group-hover:border-gray-300'
                        }`}>
                        <Icon className="w-4 h-4" />
                      </span>
                      <span className="font-medium">{item.label}</span>
                      <ChevronRight className={`w-4 h-4 ml-auto ${isActive
                        ? 'text-white'
                        : 'text-gray-300 group-hover:text-gray-400'
                        }`} />
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>
        </nav>

        {/* User info and logout - Fixed at bottom */}
        <div className="flex-shrink-0 p-4 border-t border-gray-200 bg-white">
          <div className="mb-4">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-200 bg-white text-red-600">
              <LogOut className="w-4 h-4" />
            </span>
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;