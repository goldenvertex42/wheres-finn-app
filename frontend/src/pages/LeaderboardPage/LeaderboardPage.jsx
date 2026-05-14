import React from 'react';
import { useLeaderboard } from '../../hooks/useLeaderboard';
import ScoreModal from '../../components/ScoreModal/ScoreModal';
import styles from './LeaderboardPage.module.css';

export default function LeaderboardPage() {
  const {
    leaderboardData,
    isLoading,
    scoreTimeMs,
    isEligibleSubmission,
    hasSubmitted,
    username,
    setUsername,
    handleSubmitScore
  } = useLeaderboard();

  if (isLoading) {
    return <div className={styles.loader}>Loading Arcade Rank Standings...</div>;
  }

  return (
    <div className={styles.leaderboardContainer}>
      
      {/* Renders validation modal overlay conditionally based on secure state vectors */}
      {isEligibleSubmission && !hasSubmitted && (
        <ScoreModal 
          scoreTime={scoreTimeMs}
          nameValue={username}
          onNameChange={setUsername}
          onSubmit={handleSubmitScore}
        />
      )}

      <div className={styles.tableWrapper}>
        <h2 className={styles.title}>Top 10 Global Ranks</h2>
        <ol className={styles.scoreList}>
          {leaderboardData.map((row, index) => (
            <li key={row.id} className={styles.scoreRow}>
              <span className={styles.rank}>#{index + 1}</span>
              <span className={styles.name}>{row.name}</span>
              <span className={styles.time}>{(row.timeMs / 1000).toFixed(2)}s</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
