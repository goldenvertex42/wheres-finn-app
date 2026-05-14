import { useNavigate } from 'react-router';
import { useState } from 'react';
import styles from './StartPage.module.css';

export default function StartPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleStart = async () => {
    if (isSubmitting) return; // Prevent double-clicks from spawning duplicate sessions
    setIsSubmitting(true);

    const apiUrl = import.meta.env.VITE_API_URL || '';
    try {
      // 1. Tell the backend to initialize server-side session timestamps (Security)
      const response = await fetch(`${apiUrl}/api/game/start`, { 
        method: 'POST' 
      });
      
      if (response.ok) {
        // 2. Safe Redirect: useGameSession hook handles starting the clock on mount
        navigate('/game');
      } else {
        console.error("Server rejected session initialization.");
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Failed to start game session:", error);
      setIsSubmitting(false); // Reset button lock on network failures
    }
  };

  return (
    <div className={styles.startContainer}>
      <div className={styles.welcomeCard}>
        <h2>Adventure Time Tracking</h2>
        
        <div className={styles.instructions}>
          <p>Find Finn and his friends as fast as you can!</p>
          <ul className={styles.bulletList}>
            <li>Click a character in the scene directly on their face.</li>
            <li>Identify them from the floating dropdown selection list.</li>
            <li>The top 10 fastest times make the global arcade leaderboard.</li>
          </ul>
        </div>

        <button 
          onClick={handleStart} 
          className={styles.startBtn}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Synchronizing Session..." : "Start Finding!"}
        </button>
      </div>
    </div>
  );
}
