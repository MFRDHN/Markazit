import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaWhatsapp, FaInstagram, FaYoutube, FaTelegram, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

export default function Footer() {
  const { t } = useTranslation();

  const quickLinks = [
    { to: '/program', label: t('nav.programs') },
    { to: '/biaya', label: t('nav.cost') },
    { to: '/galeri', label: t('nav.gallery') },
    { to: '/pendaftaran', label: t('nav.register') },
    { to: '/blog', label: t('nav.blog') },
    { to: '/tentang-kami', label: t('nav.about') },
  ];

  const socialLinks = [
    { icon: FaWhatsapp, href: '#', label: 'WhatsApp', color: 'hover:text-green-400' },
    { icon: FaInstagram, href: '#', label: 'Instagram', color: 'hover:text-pink-400' },
    { icon: FaYoutube, href: '#', label: 'YouTube', color: 'hover:text-red-400' },
    { icon: FaTelegram, href: '#', label: 'Telegram', color: 'hover:text-blue-400' },
  ];

  return (
    <footer className="relative bg-cream-50 border-t border-primary-900/10">
      {/* Gradient line on top */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-500/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-primary-950 font-bold text-lg shadow-lg shadow-primary-500/20">
                M
              </div>
              <div>
                <span className="text-lg font-display font-bold text-primary-950">Markaz IT</span>
                <span className="block text-xs text-primary-600 -mt-1">Madinah Study Center</span>
              </div>
            </div>
            <p className="text-primary-600 text-sm leading-relaxed mb-6">
              {t('footer.desc')}
            </p>
            <p className="text-2xl font-arabic text-primary-400/80">
              مركز تقنية المعلومات
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-primary-950 font-semibold mb-6 text-sm uppercase tracking-wider">
              {t('footer.quick_links')}
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-primary-600 hover:text-primary-400 text-sm transition-colors duration-300 flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-cream-300 group-hover:bg-primary-400 transition-colors" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-primary-950 font-semibold mb-6 text-sm uppercase tracking-wider">
              {t('footer.contact')}
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-primary-600">
                <FaMapMarkerAlt className="text-primary-400 mt-0.5 flex-shrink-0" />
                <span>Madinah Al-Munawwarah,<br />Saudi Arabia</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-primary-600">
                <FaEnvelope className="text-primary-400 flex-shrink-0" />
                <a href="mailto:info@markazit-madinah.com" className="hover:text-primary-400 transition-colors">
                  info@markazit-madinah.com
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm text-primary-600">
                <FaWhatsapp className="text-primary-400 flex-shrink-0" />
                <a href="#" className="hover:text-primary-400 transition-colors">
                  +966 xx xxx xxxx
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-primary-950 font-semibold mb-6 text-sm uppercase tracking-wider">
              {t('footer.follow')}
            </h4>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className={`w-10 h-10 rounded-xl bg-white border border-cream-200 flex items-center justify-center text-primary-600 ${social.color} hover:border-primary-500/30 hover:bg-cream-200 transition-all duration-300`}
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-primary-900/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-primary-500 text-sm">
            {t('footer.copyright')}
          </p>
          <div className="flex items-center gap-6 text-sm text-primary-500">
            <a href="#" className="hover:text-primary-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary-400 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
