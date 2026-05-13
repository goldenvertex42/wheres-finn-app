// pages/StartPage.jsx
import { useNavigate, useOutletContext } from 'react-router';
import styles from './StartPage.module.css';

export default function StartPage() {
  const { setIsTimerActive, setTime } = useOutletContext();
  const navigate = useNavigate();

  const handleStart = async () => {
    // 1. Tell the backend to start the clock (Security)
    const apiUrl = import.meta.env.VITE_API_URL;
    try {
      const response = await fetch(`${apiUrl}/api/game/start`, { 
        method: 'POST' 
      });
      
      if (response.ok) {
        // 2. Start the Header's visual timer
        setTime(0);
        setIsTimerActive(true);
        // 3. Move to the game
        navigate('/game');
      }
    } catch (error) {
      console.error("Failed to start game:", error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.instructions}>
        <p>Find Finn and his friends as fast as you can!</p>
        <ul>
          <li>Click a character in the scene.</li>
          <li>Identify them from the list.</li>
          <li>Top times make the leaderboard.</li>
        </ul>
      </div>
      <button onClick={handleStart} className={styles.startBtn}>
        Start Finding!
      </button>
    </div>
  );
}
