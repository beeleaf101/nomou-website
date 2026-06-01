import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { Mail, MapPin, Phone, Leaf } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

const quickLinks = [
  { name: 'Home', path: '/' },
  { name: 'About Us', path: '/about' },
  { name: 'Technology', path: '/technology' },
  { name: 'Live Dashboard', path: '/dashboard' },
  { name: 'Contact', path: '/contact' },
];

const resources = [
  { name: 'Documentation', path: '#' },
  { name: 'API Reference', path: '#' },
  { name: 'Research Papers', path: '/research' },
  { name: 'FAQ', path: '#' },
];

export default function Footer() {
  const { isDark } = useTheme();

  return (
    <footer className={`relative transition-colors duration-500 ${
      isDark
        ? 'bg-gradient-to-b from-[#0a120e] to-[#0d1f12] border-t border-white/5'
        : 'bg-gradient-to-b from-off-white to-pale-green/50 border-t border-green-primary/10'
    }`}>
      <div className="h-1 bg-gradient-to-r from-lime via-green-primary to-lime" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Brand */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <div className="flex items-center gap-3 mb-4">
              <img src="/images/logo.png" alt="Nomou" className={`h-12 w-auto transition-all duration-500 ${isDark ? 'brightness-[0.7] contrast-125' : ''}`} />
            </div>
            <p className={`text-sm leading-relaxed mb-6 transition-colors duration-500 ${isDark ? 'text-white/40' : 'text-gray-500'}`}>
              Smart environmental monitoring for agriculture and sustainability in Kuwait.
            </p>
            <div className="flex gap-2">
              {['X', 'in', 'gh', 'ig'].map((social) => (
                <motion.a key={social} href="#" whileHover={{ scale: 1.1, y: -2 }} whileTap={{ scale: 0.95 }}
                  className={`w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold transition-all duration-200 ${
                    isDark
                      ? 'bg-white/5 border border-white/10 text-white/50 hover:bg-green-primary hover:text-white hover:border-green-primary'
                      : 'bg-white border border-gray-200 text-gray-500 hover:bg-green-primary hover:text-white hover:border-green-primary shadow-xs'
                  }`}>
                  {social}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }}>
            <h4 className={`text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2 transition-colors duration-500 ${isDark ? 'text-white' : 'text-forest'}`}>
              <span className="w-1 h-4 bg-green-primary rounded-full" /> Quick Links
            </h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className={`text-sm flex items-center gap-2 group transition-colors duration-200 ${isDark ? 'text-white/40 hover:text-green-light' : 'text-gray-500 hover:text-green-primary'}`}>
                    <Leaf size={10} className="text-lime opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Resources */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }}>
            <h4 className={`text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2 transition-colors duration-500 ${isDark ? 'text-white' : 'text-forest'}`}>
              <span className="w-1 h-4 bg-green-primary rounded-full" /> Resources
            </h4>
            <ul className="space-y-2.5">
              {resources.map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className={`text-sm flex items-center gap-2 group transition-colors duration-200 ${isDark ? 'text-white/40 hover:text-green-light' : 'text-gray-500 hover:text-green-primary'}`}>
                    <Leaf size={10} className="text-lime opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.3 }}>
            <h4 className={`text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2 transition-colors duration-500 ${isDark ? 'text-white' : 'text-forest'}`}>
              <span className="w-1 h-4 bg-green-primary rounded-full" /> Contact
            </h4>
            <ul className="space-y-3">
              {[
                { icon: Mail, val: 'info@nomou.io' },
                { icon: Phone, val: '+965 1234 5678' },
                { icon: MapPin, val: 'Kuwait City, Kuwait' },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.val} className="flex items-start gap-2.5">
                    <div className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 transition-colors duration-500 ${
                      isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-100'
                    }`}>
                      <Icon size={14} className="text-green-primary" />
                    </div>
                    <span className={`text-sm pt-1 transition-colors duration-500 ${isDark ? 'text-white/40' : 'text-gray-500'}`}>{item.val}</span>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <div className={`mt-12 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4 transition-colors duration-500 ${
          isDark ? 'border-white/5' : 'border-green-primary/10'
        }`}>
          <p className={`text-sm transition-colors duration-500 ${isDark ? 'text-white/30' : 'text-gray-400'}`}>
            &copy; 2026 Nomou. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-sm">
            <a href="#" className={`transition-colors ${isDark ? 'text-white/30 hover:text-green-light' : 'text-gray-400 hover:text-green-primary'}`}>Privacy Policy</a>
            <span className={isDark ? 'text-white/10' : 'text-gray-200'}>|</span>
            <a href="#" className={`transition-colors ${isDark ? 'text-white/30 hover:text-green-light' : 'text-gray-400 hover:text-green-primary'}`}>Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
