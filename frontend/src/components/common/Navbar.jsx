import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { HiMenu, HiX } from 'react-icons/hi';
import { FaGlobe } from 'react-icons/fa';

const languages = [
  { code: 'id', label: 'ID', name: 'Indonesia' },
  { code: 'en', label: 'EN', name: 'English' },
  { code: 'ar', label: 'عر', name: 'العربية' },
];

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const navLinks = [
    { to: '/', label: t('nav.home') },
    { to: '/program', label: t('nav.programs') },
    { to: '/biaya', label: t('nav.cost') },
    { to: '/kehidupan-madinah', label: t('nav.life') },
    { to: '/galeri', label: t('nav.gallery') },
    { to: '/blog', label: t('nav.blog') },
    { to: '/tentang-kami', label: t('nav.about') },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    setLangOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-cream-50/90 backdrop-blur-xl border-b border-primary-900/10 shadow-2xl shadow-black/20'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-primary-950 font-bold text-lg shadow-lg shadow-primary-500/30 group-hover:shadow-primary-500/50 transition-all duration-300">
              M
            </div>
            <div>
              <span className={`text-lg font-display font-bold transition-colors ${scrolled ? 'text-primary-950 group-hover:text-primary-400' : 'text-white'}`}>
                Markaz IT
              </span>
              <span className={`hidden sm:block text-xs -mt-1 ${scrolled ? 'text-primary-600' : 'text-white/80'}`}>Madinah Study Center</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  location.pathname === link.to
                    ? (scrolled ? 'text-primary-400 bg-primary-500/10' : 'text-white bg-white/20')
                    : (scrolled ? 'text-primary-700 hover:text-primary-950 hover:bg-primary-900/5' : 'text-white/80 hover:text-white hover:bg-white/10')
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${scrolled ? 'text-primary-700 hover:text-primary-950 hover:bg-primary-900/5' : 'text-white/80 hover:text-white hover:bg-white/10'}`}
              >
                <FaGlobe className={scrolled ? 'text-primary-400' : 'text-white'} />
                <span>{languages.find((l) => l.code === i18n.language)?.label || 'ID'}</span>
              </button>
              <AnimatePresence>
                {langOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 top-full mt-2 bg-white border border-cream-300 rounded-xl overflow-hidden shadow-2xl min-w-[140px]"
                  >
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => changeLanguage(lang.code)}
                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                          i18n.language === lang.code
                            ? 'bg-primary-500/20 text-primary-400'
                            : 'text-primary-700 hover:bg-primary-900/5 hover:text-primary-950'
                        }`}
                      >
                        <span className="font-medium">{lang.label}</span>
                        <span className="ml-2 text-primary-600">{lang.name}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link to="/pendaftaran" className="btn-primary text-sm !px-6 !py-2.5">
              {t('nav.register')}
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`lg:hidden p-2 rounded-lg transition-all ${scrolled ? 'text-primary-700 hover:text-primary-950 hover:bg-primary-900/10' : 'text-white hover:bg-white/10'}`}
          >
            {isOpen ? <HiX size={24} /> : <HiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-cream-50/95 backdrop-blur-xl border-t border-primary-900/10"
          >
            <div className="px-4 py-6 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`block px-4 py-3 rounded-xl text-base transition-all ${
                    location.pathname === link.to
                      ? 'text-primary-400 bg-primary-500/10 font-medium'
                      : 'text-primary-700 hover:text-primary-950 hover:bg-primary-900/5'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-4 border-t border-primary-900/10 mt-4">
                <div className="flex gap-2 mb-4">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => changeLanguage(lang.code)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        i18n.language === lang.code
                          ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                          : 'text-primary-600 bg-white hover:text-primary-950'
                      }`}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
                <Link to="/pendaftaran" className="btn-primary block text-center">
                  {t('nav.register')}
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
