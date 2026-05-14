import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router";
import styles from "./Header.module.css";

const Header = () => {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("app-theme");
    if (savedTheme) return savedTheme;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("app-theme", theme);
  }, [theme]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 600);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleTheme = () => {
    setTheme(prev => (prev === "light" ? "dark" : "light"));
  };

  if (isMobile && location.pathname === '/game') {
    return null; 
  }
  return (
    <header className={styles.header}>
      <div className={styles.brandingGroup}>
        <h1>Where's Finn?</h1>
        {/* 2. Interactive Theme Toggle Switch Button */}
        <button onClick={toggleTheme} className={styles.themeToggleBtn} aria-label="Toggle visual layout theme">
          {theme === "light" ? "🌙 Dark" : "☀️ Light"}
        </button>
      </div>

      <div className={styles.navigationGroup}>
        {location.pathname === '/leaderboard' && (
          <Link to='/start' className={styles.link} state={null}>Try Again</Link>
        )}
        {location.pathname !== '/leaderboard' && (
          <Link to='/leaderboard' className={styles.link} state={null}>Leaderboard</Link>
        )}
      </div>
    </header>
  );
};

export default Header;