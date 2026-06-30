import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { HiMenu, HiX } from 'react-icons/hi';
import { FaGlobe } from 'react-icons/fa';
import logomarkazit from '../../assets/Logomarkazit.png';

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
  const navRef = useRef(null);

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
    setLangOpen(false);
  }, [location]);

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    setLangOpen(false);
  };

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
        scrolled
          ? 'bg-cream-50/90 backdrop-blur-xl shadow-2xl shadow-black/20'
          : 'bg-transparent'
      }`}
    >
      {/* Animated gradient border when scrolled */}
      <div className={`absolute bottom-0 left-0 right-0 h-[1px] transition-opacity duration-700 ${
        scrolled ? 'opacity-100' : 'opacity-0'
      }`}>
        <div className="w-full h-full bg-gradient-to-r from-transparent via-primary-400 to-gold-400 bg-[length:200%_100%] animate-gradient-x" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl flex items-center justify-center overflow-hidden">
              <img src={logomarkazit} alt="Markaz IT" className="w-full h-full object-contain" />
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-0">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                aria-current={location.pathname === link.to ? 'page' : undefined}
                className={`relative px-3 xl:px-4 py-1.5 text-sm font-medium transition-colors duration-300 after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:h-[2px] after:rounded-full after:transition-all after:duration-300 ${
                  location.pathname === link.to
                    ? (scrolled
                      ? 'text-primary-400 after:w-3/5 after:bg-primary-400'
                      : 'text-white after:w-3/5 after:bg-white')
                    : (scrolled
                      ? 'text-primary-700 hover:text-primary-950 after:w-0 hover:after:w-2/5 after:bg-primary-400'
                      : 'text-white/80 hover:text-white after:w-0 hover:after:w-2/5 after:bg-white')
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
                aria-expanded={langOpen}
                aria-haspopup="true"
                aria-label="Pilih Bahasa"
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
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 top-full mt-2 bg-white border border-cream-300 rounded-xl overflow-hidden shadow-2xl min-w-[140px]"
                  >
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => changeLanguage(lang.code)}
                        aria-pressed={i18n.language === lang.code}
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
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            className={`lg:hidden p-2 rounded-lg transition-all active:scale-90 ${
              scrolled ? 'text-primary-700 hover:text-primary-950 hover:bg-primary-900/10' : 'text-white hover:bg-white/10'
            }`}
            aria-label={isOpen ? 'Tutup menu' : 'Buka menu'}
          >
            {isOpen ? <HiX size={24} /> : <HiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/20 z-40 lg:hidden"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, maxHeight: 0 }}
            animate={{ opacity: 1, maxHeight: 600 }}
            exit={{ opacity: 0, maxHeight: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="lg:hidden bg-cream-50/95 backdrop-blur-xl border-t border-primary-900/10 overflow-hidden relative z-50"
          >
            <div className="px-4 py-6 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  aria-current={location.pathname === link.to ? 'page' : undefined}
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
                      aria-pressed={i18n.language === lang.code}
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
