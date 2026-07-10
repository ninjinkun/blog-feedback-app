import { useEffect } from 'react';
import { useLocation } from 'react-router';

/**
 *  This hack is from
 *  https://reacttraining.com/react-router/web/guides/scroll-restoration
 */
const ScrollToTop = () => {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  return null;
};

export default ScrollToTop;
