import { Link } from "react-router";
import Timer from "../Timer/Timer";
import styles from "./Header.module.css";

export default function Header() {
  return(
    <header className={styles.header}>
      <h1>Where's Finn?</h1>
      <Link to={'/leaderboard'}>Leaderboard</Link>
    </header>
  );
}