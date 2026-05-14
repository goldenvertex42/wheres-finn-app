import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router";
import styles from "./Header.module.css";

const Header = () => {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 600);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (isMobile && location.pathname === '/game') {
    return null; 
  }
  return (
    <header className={styles.header}>
      <h1>Where's Finn?</h1>
      {location.pathname === '/leaderboard' && <Link to={'/'} className={styles.link} state={null} >Try Again</Link>}
      {location.pathname !== '/leaderboard' && <Link to={'/leaderboard'} className={styles.link} state={null} >Leaderboard</Link>}
    </header>
  );
};

export default Header;