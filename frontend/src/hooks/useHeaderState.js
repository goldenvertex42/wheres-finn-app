import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';

export function useHeaderState() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);

  // Initialize theme choice by reading localStorage, falling back to system defaults
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("app-theme");
    if (savedTheme) return savedTheme;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

  // Effect 1: Handle live DOM synchronization and memory persistence
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("app-theme", theme);
  }, [theme]);

  // Effect 2: Monitor browser resize actions dynamically
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 600);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleTheme = () => {
    setTheme(prev => (prev === "light" ? "dark" : "light"));
  };

  // Helper action: Overwrites history state variables cleanly on navigating
  const navigateCleanly = (targetPath) => {
    navigate(targetPath, { state: null });
  };

  // Visibility Gate: Determines if the global header needs to stay unmounted
  const shouldHideHeader = isMobile && location.pathname === '/game';

  return {
    pathname: location.pathname,
    theme,
    toggleTheme,
    navigateCleanly,
    shouldHideHeader
  };
}
