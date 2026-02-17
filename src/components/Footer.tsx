import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0b0f1a] text-gray-400 py-16 px-6 border-t border-gray-800/50 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-2xl font-bold text-white tracking-tight">
                EventTrack
              </span>
            </div>
            <p className="text-sm leading-relaxed max-w-xs">
              The premier analytics suite for high-growth events. Data-driven insights to help you scale your impact.
            </p>
            {/* Social Icons */}
            <div className="flex gap-4">
              <SocialIcon svgPath="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
              <SocialIcon svgPath="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
            </div>
          </div>

          {/* Column 1: Product */}
          <FooterGroup title="Product">
            <FooterLink label="Analytics" />
            <FooterLink label="Ticketing" />
            <FooterLink label="Integrations" />
            <FooterLink label="Changelog" />
          </FooterGroup>

          {/* Column 2: Support */}
          <FooterGroup title="Company">
            <FooterLink label="About Us" />
            <FooterLink label="Careers" />
            <FooterLink label="Legal" />
            <FooterLink label="Privacy" />
          </FooterGroup>

          {/* Column 3: Newsletter */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider">Stay Updated</h3>
            <div className="relative group">
              <input 
                type="email" 
                placeholder="Email address"
                className="w-full bg-gray-900/50 border border-gray-800 rounded-lg py-3 px-4 text-sm text-gray-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              />
              <button className="mt-3 w-full bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold py-3 rounded-lg transition-all active:scale-[0.98]">
                Subscribe to Newsletter
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-gray-800/50 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-xs text-gray-500 tracking-wide">
            &copy; {currentYear} EVENTTRACK INC. ALL RIGHTS RESERVED.
          </div>
          
          <div className="flex items-center gap-2 group pointer-events-none">
            <span className="text-xs text-gray-500">Made by</span>
            <div className="px-3 py-1 bg-gray-900 border border-gray-800 rounded-full flex items-center gap-2 group-hover:border-indigo-500/50 transition-colors">
              <span className="text-sm font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Nisar
              </span>
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full shadow-[0_0_8px_#22c55e]"></div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

/* Helper Components */

const FooterGroup = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="flex flex-col gap-4">
    <h3 className="text-white font-semibold text-sm uppercase tracking-wider">{title}</h3>
    <ul className="flex flex-col gap-3">{children}</ul>
  </div>
);

const FooterLink = ({ label }: { label: string }) => (
  <li>
    <a href="#" className="text-sm text-gray-400 hover:text-indigo-400 transition-colors duration-200">
      {label}
    </a>
  </li>
);

const SocialIcon = ({ svgPath }: { svgPath: string }) => (
  <a href="#" className="w-10 h-10 rounded-lg bg-gray-900 border border-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:border-gray-600 transition-all">
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d={svgPath} />
    </svg>
  </a>
);

export default Footer;