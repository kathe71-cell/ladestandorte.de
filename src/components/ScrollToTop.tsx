import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ArrowUp } from 'lucide-react';

export const ScrollToTop: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const { pathname } = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // Track scroll position to show/hide floating button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Nach oben scrollen"
      title="Nach oben scrollen"
      className="fixed bottom-6 right-6 z-40 p-3 rounded-full bg-[#171917] hover:bg-black text-white border border-[#DFE3DC]/20 shadow-xl hover:shadow-2xl transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#171917] focus:ring-offset-2 flex items-center justify-center group"
    >
      <ArrowUp className="w-5 h-5 text-white group-hover:text-[#C7F000] group-hover:-translate-y-0.5 transition-transform duration-150" />
    </button>
  );
};

export default ScrollToTop;
