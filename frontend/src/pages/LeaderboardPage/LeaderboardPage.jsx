import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import styles from './LeaderboardPage.module.css';

export default function LeaderboardPage() {
  const location = useLocation();
  const scoreTimeMs = location.state?.scoreTimeMs;

  const [scores, setScores] = useState([]);
  const [username, setUsername] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionFeedback, setSubmissionFeedback] = useState(null);
  
  const apiUrl = import.meta.env.VITE_API_URL;

  // 1. Fetch current top scores on mount
  const fetchScores = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/leaderboard`);
      if (response.ok) {
        const data = await response.json();
        setScores(data);
      }
    } catch (error) {
      console.error("Failed to load scores:", error);
    }
  };

  useEffect(() => {
    fetchScores();
  }, []);

  // 2. Format Milliseconds helper to match your Header's MM:SS format
  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const mins = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const secs = (totalSeconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  // 3. Handle High Score Input Form Submission
  const handleSubmitScore = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`${apiUrl}/api/leaderboard`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username.trim(), // Server handles fallback to 'Anonymous' if empty
          timeMs: scoreTimeMs
        })
      });

      const data = await response.json();
      setSubmissionFeedback(data.message);
      
      // Clear out the state token so they don't submit twice on page refresh
      window.history.replaceState({}, document.title);
      
      // Refresh list to show their new rank
      fetchScores(); 
    } catch (error) {
      console.error("Submission failed:", error);
      setSubmissionFeedback("Network error. Could not save score.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* Conditional high score prompt banner */}
      {scoreTimeMs && !submissionFeedback && (
        <div className={styles.promptCard}>
          <h2>🎉 You finished in {formatTime(scoreTimeMs)}!</h2>
          <p>Enter your tag to see if you made the Top 10:</p>
          <form onSubmit={handleSubmitScore} className={styles.form}>
            <input 
              type="text" 
              placeholder="Anonymous" 
              maxLength={15}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isSubmitting}
              className={styles.input}
            />
            <button type="submit" disabled={isSubmitting} className={styles.submitBtn}>
              {isSubmitting ? "Checking..." : "Submit Score"}
            </button>
          </form>
        </div>
      )}

      {/* Show validation result message (e.g., "Congratulations!" or "Great effort...") */}
      {submissionFeedback && (
        <div className={styles.feedbackCard}>
          <p>{submissionFeedback}</p>
        </div>
      )}

      {/* The Leaderboard Standings Stand */}
      <div className={styles.boardCard}>
        <h1>Top 10 High Scores</h1>
        {scores.length === 0 ? (
          <p className={styles.loading}>Loading standings...</p>
        ) : (
          <ol className={styles.list}>
            {scores.map((score, index) => (
              <li key={score.id} className={styles.listItem}>
                <span className={styles.rank}>#{index + 1}</span>
                <span className={styles.name}>{score.name}</span>
                <span className={styles.time}>{formatTime(score.timeMs)}</span>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}
