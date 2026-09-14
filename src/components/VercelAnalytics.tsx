import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { pageview } from '@vercel/analytics';

export default function VercelAnalytics() {
  const location = useLocation();

  useEffect(() => {
    try {
      pageview({
        route: location.pathname,
        path: location.pathname + location.search
      });
    } catch {
      // Ignore if analytics hasn't initialized yet
    }
  }, [location.pathname, location.search]);

  return <Analytics />;
}
