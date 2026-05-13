import styles from './TargetBox.module.css'

export default function TargetBox({x, y, characters, onSelect, isNearRightEdge}) {
  return(
  <div 
    className={styles.targetContainer} 
    style={{ left: `${x}%`, top: `${y}%` }}
    onClick={(e) => e.stopPropagation()}
  >
    <div className={styles.reticle}></div>
    <ul className={`${styles.dropdown} ${isNearRightEdge ? styles.dropdownLeft : ''}`}>
      {characters.map((char) => (
        <li 
          key={char.id} 
          className={styles.dropdownItem}
          onClick={() => onSelect(char.name)}
        >
          {char.name}
        </li>
      ))}
    </ul>
  </div>);
}