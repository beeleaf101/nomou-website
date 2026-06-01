import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../hooks/useAuth';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'About Us', path: '/about' },
  { name: 'Nodes', path: '/nodes' },
  { name: 'Technology', path: '/technology' },
  { name: 'Live Dashboard', path: '/dashboard' },
  { name: 'Research & Data', path: '/research' },
  { name: 'Pricing', path: '/pricing' },
  { name: 'Contact', path: '/contact' },
];


export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isDark, toggle } = useTheme();
  const { isLoggedIn, user } = useAuth();
  const location = useLocation();

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isDark
            ? 'bg-[#0a120e]/90 backdrop-blur-xl border-b border-white/5'
            : 'bg-white/90 backdrop-blur-xl border-b border-gray-200/50 shadow-sm'
        }`}
        style={{ height: 70 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-full flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 shrink-0 group">
            <motion.img
              whileHover={{ rotate: -5, scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300 }}
              src="/images/logo.png"
              alt="Nomou"
              className={`h-10 w-auto transition-all duration-300 ${
                isDark ? 'brightness-[0.7] contrast-125' : ''
              }`}
            />
            <div className="hidden sm:block">
              <span className={`text-sm font-bold tracking-wide ${isDark ? 'text-white' : 'text-forest'}`}>
                NOMOU
              </span>
              <p className={`text-[10px] -mt-0.5 ${isDark ? 'text-white/30' : 'text-gray-400'}`}>
                Smart Environmental Monitoring
              </p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-0.5">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <motion.div
                  key={link.path}
                  whileHover={{ y: -2, scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                >
                  <Link
                    to={link.path}
                    className={`relative px-3 py-2 text-sm font-medium rounded-xl block transition-all duration-200 ${
                      isActive
                        ? (isDark ? 'text-green-light' : 'text-green-primary') + (isDark ? ' bg-white/5' : ' bg-green-primary/5')
                        : isDark
                          ? 'text-white/50 hover:text-white hover:bg-white/[0.07]'
                          : 'text-gray-500 hover:text-forest hover:bg-green-primary/[0.06]'
                    }`}
                  >
                    {link.name}
                    {/* Active indicator */}
                    {isActive && (
                      <motion.div
                        layoutId="activeNav"
                        className={`absolute bottom-0 left-3 right-3 h-0.5 rounded-full ${
                          isDark ? 'bg-green-light' : 'bg-green-primary'
                        }`}
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                    {/* Hover underline */}
                    {!isActive && (
                      <span className={`absolute bottom-0 left-3 right-3 h-0.5 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left ${
                        isDark ? 'bg-white/20' : 'bg-green-primary/30'
                      }`} />
                    )}
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Auth buttons */}
            {isLoggedIn ? (
              <Link to="/portal/dashboard">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-green-primary text-white text-sm font-bold hover:bg-green-light transition-colors">
                  <span className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center text-xs font-black">
                    {user?.name?.charAt(0)}
                  </span>
                  Portal
                </motion.div>
              </Link>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/auth">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    className={`px-4 py-1.5 rounded-xl text-sm font-semibold transition-colors ${isDark ? 'text-white/70 hover:text-white hover:bg-white/10' : 'text-gray-600 hover:text-forest hover:bg-gray-100'}`}>
                    Log In
                  </motion.div>
                </Link>
                <Link to="/auth?tab=signup">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    className="px-4 py-1.5 rounded-xl text-sm font-bold bg-green-primary text-white hover:bg-green-light transition-colors">
                    Sign Up
                  </motion.div>
                </Link>
              </div>
            )}


            {/* Theme Toggle */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggle}
              className={`relative w-14 h-8 rounded-full p-1 transition-colors duration-300 ${
                isDark
                  ? 'bg-white/10 border border-white/10'
                  : 'bg-gray-100 border border-gray-200'
              }`}
            >
              <motion.div
                animate={{ x: isDark ? 24 : 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className={`w-6 h-6 rounded-full flex items-center justify-center shadow-md ${
                  isDark ? 'bg-green-primary' : 'bg-amber-400'
                }`}
              >
                {isDark ? (
                  <Moon size={13} className="text-white" />
                ) : (
                  <Sun size={13} className="text-white" />
                )}
              </motion.div>
            </motion.button>

            {/* Mobile Menu Button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setMobileOpen(!mobileOpen)}
              className={`lg:hidden p-2 rounded-xl transition-colors ${
                isDark ? 'text-white hover:bg-white/10' : 'text-forest hover:bg-pale-green'
              }`}
            >
              <AnimatePresence mode="wait">
                {mobileOpen ? (
                  <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <X size={24} />
                  </motion.div>
                ) : (
                  <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <Menu size={24} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: 320 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 320 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={`fixed top-0 right-0 bottom-0 w-80 z-[60] overflow-y-auto ${
              isDark ? 'bg-[#0a120e] border-l border-white/5' : 'bg-white border-l border-gray-100'
            }`}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <img
                  src="/images/logo.png"
                  alt="Nomou"
                  className={`h-10 ${isDark ? 'brightness-[0.7] contrast-125' : ''}`}
                />
                <motion.button whileTap={{ scale: 0.9 }} onClick={() => setMobileOpen(false)}
                  className={`p-2 rounded-lg ${isDark ? 'hover:bg-white/10 text-white' : 'hover:bg-pale-green text-forest'}`}>
                  <X size={20} />
                </motion.button>
              </div>

              <div className="flex flex-col gap-1">
                {navLinks.map((link, i) => {
                  const isActive = location.pathname === link.path;
                  return (
                    <motion.div key={link.path} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                      <Link to={link.path}
                        className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                          isActive
                            ? isDark ? 'bg-green-primary/10 text-green-light' : 'bg-pale-green text-green-primary'
                            : isDark ? 'text-white/60 hover:bg-white/5 hover:text-white' : 'text-gray-600 hover:bg-gray-50 hover:text-forest'
                        }`}>
                        {link.name}
                      </Link>
                    </motion.div>
                  );
                })}
              </div>

              {/* Mobile Theme Toggle */}
              <div className={`mt-6 pt-6 border-t ${isDark ? 'border-white/10' : 'border-gray-100'}`}>
                <button
                  onClick={toggle}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                    isDark ? 'text-white/60 hover:bg-white/5' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {isDark ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-indigo-500" />}
                  <span className="text-sm font-medium">Switch to {isDark ? 'Light' : 'Dark'} Mode</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-[55] lg:hidden backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
