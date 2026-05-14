import React from 'react';
import styles from './GameHeader.module.css';

export default function GameHeader({ time, remainingCount }) {
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
    </div>
  );
}
