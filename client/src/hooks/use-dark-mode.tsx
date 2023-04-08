import React, { useEffect, useState } from 'react';

const useDarkMode = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const storedValue = window.localStorage.getItem('is-dark-mode');
    return storedValue ? JSON.parse(storedValue) : false;
  });

  useEffect(() => {
    window.localStorage.setItem('is-dark-mode', isDarkMode);
  }, [isDarkMode]);

  return {
    isDarkMode,
    setIsDarkMode
  };
};

export default useDarkMode;