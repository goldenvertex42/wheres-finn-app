import { Link } from "react-router";
import styles from "./Header.module.css";

const Header = ({ time }) => {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  return (
    <header className={styles.header}>
      <h1>Where's Finn and His Friends?</h1>
      <div className={styles.timerDisplay}>{formatTime(time)}</div>
      <Link to={'/leaderboard'}>Leaderboard</Link>
    </header>
  );
};

export default Header;