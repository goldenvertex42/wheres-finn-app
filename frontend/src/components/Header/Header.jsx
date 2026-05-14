import { Link } from 'react-router';
import { useHeaderState } from '../../hooks/useHeaderState';
import styles from './Header.module.css';

export default function Header() {
  const {
    pathname,
    theme,
    toggleTheme,
    navigateCleanly,
    shouldHideHeader
  } = useHeaderState();

  // If the hook flag triggers the mobile lockout view perimeter, unmount cleanly
  if (shouldHideHeader) {
    return null;
  }

  return (
    <header className={styles.header}>
      <div className={styles.brandingGroup}>
        <h1>Where's Finn?</h1>
        <button 
          onClick={toggleTheme} 
          className={styles.themeToggleBtn} 
          aria-label="Toggle visual layout theme"
        >
          {theme === "light" ? "🌙 Dark" : "☀️ Light"}
        </button>
      </div>

      <div className={styles.navigationGroup}>
        {pathname === '/leaderboard' ? (
          <button 
            onClick={() => navigateCleanly('/')} 
            className={styles.linkButton}
          >
            Try Again
          </button>
        ) : (
          <button 
            onClick={() => navigateCleanly('/leaderboard')} 
            className={styles.linkButton}
          >
            Leaderboard
          </button>
        )}
      </div>
    </header>
  );
}
