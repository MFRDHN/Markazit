import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaWhatsapp, FaInstagram, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import logomarkazit from '../../assets/Logomarkazit.png';
import InteractiveBackground from '../common/InteractiveBackground';

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
    { icon: FaWhatsapp, href: 'https://wa.me/62817786805', label: 'WhatsApp', color: 'hover:text-green-400' },
    { icon: FaInstagram, href: 'https://www.instagram.com/markazit_/', label: 'Instagram', color: 'hover:text-pink-400' },
  ];

  return (
    <footer className="relative bg-primary-950 border-t border-primary-800">
      {/* Gradient line on top */}
      <InteractiveBackground color="rgba(216, 179, 100, 0.12)" lineColor="rgba(216, 179, 100, 0.05)" particleCount={25} />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-500/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="mb-4">
              <div className="w-32 h-32 sm:w-40 sm:h-40 lg:w-44 lg:h-44 rounded-xl flex items-center justify-center overflow-hidden">
                <img src={logomarkazit} alt="Markaz IT" className="w-full h-full object-contain" />
              </div>
            </div>
            <p className="text-cream-100/70 text-sm leading-relaxed mb-6">
              {t('footer.desc')}
            </p>
            <p className="text-2xl font-arabic text-gold-400/70">
              مركز تقنية المعلومات
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-gold-400 font-semibold mb-6 text-sm uppercase tracking-wider">
              {t('footer.quick_links')}
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-cream-100/70 hover:text-gold-400 text-sm transition-colors duration-300 flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-primary-700 group-hover:bg-gold-400 transition-colors" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-gold-400 font-semibold mb-6 text-sm uppercase tracking-wider">
              {t('footer.contact')}
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-cream-100/70">
                <FaMapMarkerAlt className="text-gold-400 mt-0.5 flex-shrink-0" />
                <span>Madinah Al-Munawwarah,<br />Saudi Arabia</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-cream-100/70">
                <FaEnvelope className="text-gold-400 flex-shrink-0" />
                <a href="mailto:markazitmadinah@gmail.com" className="hover:text-gold-400 transition-colors">
                  markazitmadinah@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm text-cream-100/70">
                <FaWhatsapp className="text-gold-400 flex-shrink-0" />
                <a href="https://wa.me/62817786805" className="hover:text-gold-400 transition-colors">
                  +62 817-7868-05
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-gold-400 font-semibold mb-6 text-sm uppercase tracking-wider">
              {t('footer.follow')}
            </h4>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className={`w-10 h-10 rounded-xl bg-primary-800 border border-primary-700 flex items-center justify-center text-cream-100/70 ${social.color} hover:border-gold-400/50 hover:bg-primary-700 transition-all duration-300`}
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-primary-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-cream-100/50 text-sm">
            {t('footer.copyright')}
          </p>
          <div className="flex items-center gap-6 text-sm text-cream-100/50">
            <a href="#" className="hover:text-gold-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-gold-400 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
