import styles from './Footer.module.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <p className={styles.creditText}>
        Created for The Odin Project © {currentYear}
      </p>
      
      <div className={styles.linksGroup}>
        <a 
          href="https://github.com/goldenvertex42/wheres-finn-app" 
          target="_blank" 
          rel="noreferrer" 
          className={styles.footerLink}
        >
          Source Code
        </a>
        <span className={styles.divider}>•</span>
        <span className={styles.attribution}>
          Artwork by 
          <a 
            href="https://wallpapers.com/wallpapers/adventure-time-inhabitants-of-ooo-2qmbaaawho7a0j7z.html" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            buffet
          </a> - Used with permission
        </span>
      </div>
    </footer>
  );
}