import { useHeaderState } from '../../hooks/useHeaderState';
import styles from './GameHeader.module.css';

export default function GameHeader({ time, remainingCount }) {
  const {
    theme,
    toggleTheme,
    shouldHideHeader
  } = useHeaderState();
  
  return (
    <div className={styles.floatingTimerWidget}>
      <div className={styles.metricGroup}>
        <span className={styles.icon}>⏱️</span>
        <span className={styles.digits}>{time}</span>
      </div>
      <div className={styles.divider} />
      <div className={styles.metricGroup}>
        <span className={styles.icon}>🧩</span>
        <span className={styles.countText}>{remainingCount} remaining</span>
      </div>
      {shouldHideHeader && (
        <>
          <div className={styles.divider} />
          <button 
            onClick={toggleTheme} 
            className={styles.themeToggleBtn} 
            aria-label="Toggle visual layout theme"
          >
            {theme === "light" ? "🌙 Dark" : "☀️ Light"}
          </button>
        </>
      )}
    </div>
  );
}
