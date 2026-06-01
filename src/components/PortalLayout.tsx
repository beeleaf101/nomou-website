import { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Map, FileBarChart2, Wrench, CreditCard,
  LogOut, Menu, Leaf, Bell, ChevronRight, Receipt,
  CheckCircle, AlertTriangle, Info, X,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { usePayments } from '../hooks/usePayments';
import { useTheme } from '../hooks/useTheme';

const navItems = [
  { path: '/portal/dashboard',    icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/portal/map',          icon: Map,             label: 'Node Map' },
  { path: '/portal/reports',      icon: FileBarChart2,   label: 'Reports' },
  { path: '/portal/maintenance',  icon: Wrench,          label: 'Maintenance' },
  { path: '/portal/payments',     icon: Receipt,         label: 'Payments' },
  { path: '/portal/subscription', icon: CreditCard,      label: 'Subscription' },
];

const notifIcons = {
  info:    { icon: Info,          color: '#03A9F4' },
  warning: { icon: AlertTriangle, color: '#FF9800' },
  success: { icon: CheckCircle,   color: '#4CAF50' },
  error:   { icon: AlertTriangle, color: '#ef4444' },
};

export default function PortalLayout() {
  const { user, logout } = useAuth();
  const { notifications, unreadCount, markNotificationRead, markAllRead, payments } = usePayments();
  const { isDark, toggle } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); };

  const planColors: Record<string, string> = {
    free: '#8BC34A', standard: '#03A9F4', premium: '#2D7A3E', supreme: '#FF9800',
  };

  const unpaidCount = payments.filter(p => p.status === 'unpaid').length;

  const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
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
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-black shrink-0"
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
          const hasAlert = item.path === '/portal/payments' && unpaidCount > 0;
          return (
            <Link key={item.path} to={item.path} onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                active
                  ? isDark ? 'bg-green-primary/20 text-green-light' : 'bg-green-primary/10 text-green-primary'
                  : isDark ? 'text-white/50 hover:text-white hover:bg-white/5' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
              }`}>
              <Icon size={17} />
              {item.label}
              {hasAlert && (
                <span className="ml-auto w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {unpaidCount}
                </span>
              )}
              {active && !hasAlert && <ChevronRight size={13} className="ml-auto" />}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className={`p-3 border-t ${isDark ? 'border-white/5' : 'border-gray-100'} space-y-0.5`}>
        <button onClick={toggle}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${isDark ? 'text-white/40 hover:text-white hover:bg-white/5' : 'text-gray-400 hover:text-gray-700 hover:bg-gray-50'}`}>
          <span>{isDark ? '☀️' : '🌙'}</span>
          {isDark ? 'Light Mode' : 'Dark Mode'}
        </button>
        <button onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-red-500 hover:bg-red-50">
          <LogOut size={17} /> Log Out
        </button>
      </div>
    </div>
  );

  return (
    <div className={`flex h-screen overflow-hidden ${isDark ? 'bg-[#0a120e]' : 'bg-gray-50'}`}>
      {/* Desktop sidebar */}
      <div className="hidden lg:flex flex-col w-60 shrink-0"><Sidebar /></div>

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
            {/* Notification Bell */}
            <div className="relative">
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                onClick={() => setNotifOpen(!notifOpen)}
                className={`relative p-2 rounded-xl transition-colors ${isDark ? 'text-white/40 hover:bg-white/5 hover:text-white' : 'text-gray-400 hover:bg-gray-100 hover:text-gray-700'}`}>
                <Bell size={18} />
                {unreadCount > 0 && (
                  <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}
                    className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </motion.span>
                )}
              </motion.button>

              {/* Notification dropdown */}
              <AnimatePresence>
                {notifOpen && (
                  <>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="fixed inset-0 z-30" onClick={() => setNotifOpen(false)} />
                    <motion.div initial={{ opacity: 0, y: -8, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.97 }}
                      transition={{ duration: 0.15 }}
                      className={`absolute right-0 top-full mt-2 w-80 rounded-2xl shadow-2xl border z-40 overflow-hidden ${isDark ? 'bg-[#0d1f12] border-white/10' : 'bg-white border-gray-100'}`}>
                      {/* Header */}
                      <div className={`flex items-center justify-between px-4 py-3 border-b ${isDark ? 'border-white/5' : 'border-gray-100'}`}>
                        <p className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          Notifications {unreadCount > 0 && <span className="text-xs text-red-500 ml-1">({unreadCount} new)</span>}
                        </p>
                        {unreadCount > 0 && (
                          <button onClick={markAllRead} className="text-xs text-green-primary font-semibold hover:text-green-light transition-colors">
                            Mark all read
                          </button>
                        )}
                      </div>

                      {/* Notifications list */}
                      <div className="max-h-80 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className={`py-8 text-center text-sm ${isDark ? 'text-white/30' : 'text-gray-400'}`}>
                            <Bell size={20} className="mx-auto mb-2 opacity-40" />
                            No notifications
                          </div>
                        ) : (
                          notifications.map(n => {
                            const nc = notifIcons[n.type];
                            const NIcon = nc.icon;
                            return (
                              <motion.div key={n.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                onClick={() => markNotificationRead(n.id)}
                                className={`flex gap-3 px-4 py-3 cursor-pointer transition-colors border-b last:border-0 ${
                                  !n.read
                                    ? isDark ? 'bg-white/[0.04] border-white/5' : 'bg-green-primary/[0.03] border-gray-50'
                                    : isDark ? 'border-white/5' : 'border-gray-50'
                                } hover:bg-green-primary/5`}>
                                <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                                  style={{ backgroundColor: `${nc.color}20` }}>
                                  <NIcon size={13} style={{ color: nc.color }} />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between gap-2">
                                    <p className={`text-xs font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{n.title}</p>
                                    {!n.read && <span className="w-2 h-2 rounded-full bg-green-primary shrink-0 mt-1" />}
                                  </div>
                                  <p className={`text-[11px] mt-0.5 leading-relaxed ${isDark ? 'text-white/40' : 'text-gray-500'}`}>{n.message}</p>
                                  <p className={`text-[10px] mt-1 ${isDark ? 'text-white/25' : 'text-gray-300'}`}>{n.createdAt}</p>
                                </div>
                              </motion.div>
                            );
                          })
                        )}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Plan badge */}
            <Link to="/portal/subscription"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold capitalize"
              style={{ backgroundColor: `${planColors[user?.plan ?? 'free']}20`, color: planColors[user?.plan ?? 'free'] }}>
              <Leaf size={12} /> {user?.plan}
            </Link>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
