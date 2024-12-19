import { useTheme } from '@camino/ui';
import { clsx } from 'clsx';
import Typography from '../Typography';
import CamBtn from '../cam-btn/CamBtn';

const Footer = () => {
  const { theme } = useTheme();

  // Dynamic Footer Data
  const footerData = {
    description:
      'Camino is the travel industry blockchain. Fueled by the Camino token, it offers a versatile network to expand business models and create new touristic products.',
    links: [
      {
        title: 'Camino Network',
        items: [
          'The Network',
          'Use Cases',
          'Validators',
          'Web3 Travel',
          'Camino Messenger',
        ],
      },
      {
        title: 'Discover',
        items: ['Community', 'Blog', 'News', 'Entities'],
      },
      {
        title: 'Organizational',
        items: [
          'Foundation',
          'Imprint',
          'Privacy Policy',
          'Terms of Use',
          'Code of Conduct',
        ],
      },
    ],
    buttons: [
      { label: 'Camino Website', href: '#' },
      { label: 'Documentation', href: '#' },
      { label: 'Whitepaper', href: '#' },
    ],
    socialMedia: ['✈️', '🔗', '🎮', '▶️', '🐱', '✉️'], // Replace with real icons later
  };

  return (
    <footer
      className={clsx(
        'w-full px-6 py-10 border-t border-slate-400',
        theme === 'light' ? 'bg-white text-black' : 'bg-slate-950 text-white'
      )}
    >
      <div className="container mx-auto">
        {/* Top Section */}
        <div className="flex flex-col justify-between gap-8 mb-10 lg:flex-row">
          {/* Logo and Description */}
          <div className="max-w-sm">
            <div className="flex items-center gap-2 mb-4">
              {/* <CaminoLogo /> */}
            </div>
            <Typography variant="caption" as="p">
              {footerData.description}
            </Typography>
            {/* Social Icons */}
            <div className="flex gap-4 mt-6">
              {footerData.socialMedia.map((icon, index) => (
                <button
                  key={index}
                  className={clsx(
                    'text-2xl transition-all bg-transparent border-none cursor-pointer',
                    theme === 'light'
                      ? 'text-gray-500 hover:text-black'
                      : 'text-gray-400 hover:text-white'
                  )}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-wrap gap-8 text-sm lg:gap-16">
            {footerData.links.map((section, index) => (
              <div key={index}>
                <Typography variant="h4" as="h4" className="mb-3">
                  {section.title}
                </Typography>
                <ul className="space-y-2">
                  {section.items.map((item, idx) => (
                    <li key={idx}>
                      <button
                        className={clsx(
                          'hover:underline bg-transparent border-none cursor-pointer',
                          theme === 'light'
                            ? 'text-slate-950'
                            : 'text-slate-100 hover:text-white'
                        )}
                      >
                        <Typography variant="caption" as="p">
                          {item}
                        </Typography>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap w-full gap-4 mb-10">
          {footerData.buttons.map((button, index) => (
            <CamBtn key={index} variant="secondary">
              {button.label}
            </CamBtn>
          ))}
        </div>

        {/* Bottom Section */}
        <div
          className={clsx(
            'w-full border-t pt-6 text-center text-xs border-slate-400'
          )}
        >
          <Typography
            variant="caption"
            as="p"
            color={theme === 'light' ? '#666' : '#BBB'}
          >
            &copy; 2024 Camino Network Foundation. All rights reserved.
          </Typography>
          <Typography
            variant="caption"
            as="p"
            color={theme === 'light' ? '#666' : '#BBB'}
          >
            v1.5.0-rc-194-ga6e5eb8
          </Typography>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
