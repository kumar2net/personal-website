import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const RouterTest = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Test that React Router context is properly available
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      console.log('Router Test - Location:', location.pathname);
      console.log('Router Test - Navigate function available:', typeof navigate === 'function');
    }
  }, [location, navigate]);

  return (
    <div data-testid="router-test">
      {children}
    </div>
  );
};

export default RouterTest;
