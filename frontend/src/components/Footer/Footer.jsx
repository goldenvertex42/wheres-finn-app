import styles from './Footer.module.css'

export default function Footer() {
  return(
    <footer className={styles.footer}>
      <p>
        Art by 
        <a 
          href="https://wallpapers.com/wallpapers/adventure-time-inhabitants-of-ooo-2qmbaaawho7a0j7z.html" 
          target="_blank" 
          rel="noopener noreferrer"
        >
          buffet
        </a> - Used with permission
      </p>
    </footer>
  );
}