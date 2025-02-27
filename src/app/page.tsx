'use client';

import { useState, useEffect } from 'react';
import Home from '@/components/Home';
import SignIn from '@/components/SignIn';

export default function Page() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // TODO: Implement proper authentication check
  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = () => {
      // For now, just check if we have any auth token
      const token = localStorage.getItem('authToken');
      setIsAuthenticated(!!token);
    };

    checkAuth();
  }, []);

  return isAuthenticated ? <Home /> : <SignIn />;
}
