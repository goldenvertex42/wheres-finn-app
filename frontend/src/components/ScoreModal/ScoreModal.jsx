import React from 'react';
import styles from './ScoreModal.module.css';

export default function ScoreModal({ scoreTime, nameValue, onNameChange, onSubmit }) {
  return (
    <div className={styles.victoryModalOverlay}>
      <div className={styles.victoryCard}>
        <h2>🏆 New High Score!</h2>
        <p>You finished in <strong>{(scoreTime / 1000).toFixed(2)}s</strong>.</p>
        <form onSubmit={onSubmit} className={styles.submitForm}>
          <input 
            type="text" 
            placeholder="Enter Arcade Tag (e.g. FINN)" 
            maxLength={10}
            value={nameValue}
            onChange={(e) => onNameChange(e.target.value)}
            className={styles.usernameInput}
            required
            autoFocus
          />
          <button type="submit" className={styles.submitBtn}>Lock It In</button>
        </form>
      </div>
    </div>
  );
}
