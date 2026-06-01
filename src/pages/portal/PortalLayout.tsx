import { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Map, FileBarChart2, Wrench, CreditCard,
  LogOut, Menu, Leaf, Bell, ChevronRight, Crown,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';

const navItems = [
  { path: '/portal/dashboard',    icon: LayoutDashboard, label: 'Dashboard',   supreme: false },
  { path: '/portal/map',          icon: Map,             label: 'Node Map',    supreme: false },
  { path: '/portal/reports',      icon: FileBarChart2,   label: 'Reports',     supreme: false },
  { path: '/portal/maintenance',  icon: Wrench,          label: 'Maintenance', supreme: false },
  { path: '/portal/analysis',     icon: Crown,           label: 'AI Analysis', supreme: true  },
  { path: '/portal/subscription', icon: CreditCard,      label: 'Subscription',supreme: false },
];

export default function PortalLayout() {
  const { user, logout } = useAuth();
  const { isDark, toggle } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); };

  const planColors: Record<string, string> = {
    free: '#8BC34A', standard: '#03A9F4', premium: '#2D7A3E', supreme: '#FF9800',
  };

  const Sidebar = ({ mobile = false }) => (
    <div className={`flex flex-col h-full ${isDark ? 'bg-[#0d1f12]' : 'bg-white'} ${mobile ? '' : 'border-r ' + (isDark ? 'border-white/5' : 'border-gray-100')}`}>
      {/* Logo */}
      <div className={`p-5 border-b ${isDark ? 'border-white/5' : 'border-gray-100'}`}>
        <Link to="/" className="flex items-center gap-2">
          <img src="/images/logo.png" alt="Nomou" className={`h-8 ${isDark ? 'brightness-75 contrast-125' : ''}`} />
          <span className={`font-black text-sm tracking-wide ${isDark ? 'text-white' : 'text-forest'}`}>NOMOU</span>
        </Link>
      </div>

      {/* User card */}
      <div className={`mx-3 mt-4 p-3 rounded-2xl ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-black"
            style={{ backgroundColor: planColors[user?.plan ?? 'free'] }}>
            {user?.name?.charAt(0)}
          </div>
          <div className="min-w-0">
            <p className={`text-sm font-semibold truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>{user?.name}</p>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold capitalize"
              style={{ backgroundColor: `${planColors[user?.plan ?? 'free']}20`, color: planColors[user?.plan ?? 'free'] }}>
              {user?.plan}
            </span>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5 mt-2">
        {navItems.map(item => {
          const Icon = item.icon;
          const active = location.pathname === item.path;
          const isLocked = item.supreme && user?.plan !== 'gold' && user?.plan !== 'trial';
          return (
            <Link key={item.path} to={item.path} onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                active
                  ? isDark ? 'bg-green-primary/20 text-green-light' : 'bg-green-primary/10 text-green-primary'
                  : isLocked
                    ? isDark ? 'text-white/25' : 'text-gray-300'
                    : isDark ? 'text-white/50 hover:text-white hover:bg-white/5' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
              }`}>
              <Icon size={17} className={item.supreme && !isLocked ? 'text-amber-400' : ''} />
              <span className="flex-1">{item.label}</span>
              {item.supreme && (
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${isLocked ? 'bg-gray-200 text-gray-400' : 'bg-amber-100 text-amber-600'}`}>
                  {isLocked ? 'LOCK' : 'AI'}
                </span>
              )}
              {active && !item.supreme && <ChevronRight size={13} className="ml-auto" />}
            </Link>
          );
        })}
      </nav>

      {/* Bottom actions */}
      <div className={`p-3 border-t ${isDark ? 'border-white/5' : 'border-gray-100'} space-y-0.5`}>
        <button onClick={toggle}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${isDark ? 'text-white/40 hover:text-white hover:bg-white/5' : 'text-gray-400 hover:text-gray-700 hover:bg-gray-50'}`}>
          <span className="text-base">{isDark ? '☀️' : '🌙'}</span>
          {isDark ? 'Light Mode' : 'Dark Mode'}
        </button>
        <button onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-red-500 hover:bg-red-50`}>
          <LogOut size={17} />
          Log Out
        </button>
      </div>
    </div>
  );

  return (
    <div className={`flex h-screen overflow-hidden ${isDark ? 'bg-[#0a120e]' : 'bg-gray-50'}`}>
      {/* Desktop sidebar */}
      <div className="hidden lg:flex flex-col w-60 shrink-0">
        <Sidebar />
      </div>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
              onClick={() => setSidebarOpen(false)} />
            <motion.div initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-64 z-50 lg:hidden">
              <Sidebar mobile />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className={`h-14 flex items-center justify-between px-4 sm:px-6 border-b shrink-0 ${isDark ? 'bg-[#0d1f12] border-white/5' : 'bg-white border-gray-100'}`}>
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className={`lg:hidden p-2 rounded-lg ${isDark ? 'text-white/60 hover:bg-white/5' : 'text-gray-500 hover:bg-gray-100'}`}>
              <Menu size={20} />
            </button>
            <h1 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {navItems.find(n => n.path === location.pathname)?.label ?? 'Portal'}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button className={`p-2 rounded-lg relative ${isDark ? 'text-white/40 hover:bg-white/5' : 'text-gray-400 hover:bg-gray-100'}`}>
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-green-primary rounded-full" />
            </button>
            <Link to="/portal/subscription"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold capitalize"
              style={{ backgroundColor: `${planColors[user?.plan ?? 'free']}20`, color: planColors[user?.plan ?? 'free'] }}>
              <Leaf size={12} /> {user?.plan}
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
