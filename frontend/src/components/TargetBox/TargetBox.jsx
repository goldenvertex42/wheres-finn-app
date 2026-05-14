import styles from './TargetBox.module.css'

export default function TargetBox({x, y, characters, onSelect, isNearRightEdge, isNearLeftEdge, isNearBottomEdge}) {
  const isLoading = !characters || characters.length === 0;

  let dropdownClasses = [styles.dropdown];

  if (isNearBottomEdge) dropdownClasses.push(styles.dropdownTop);
  if (isNearRightEdge) dropdownClasses.push(styles.dropdownLeft);
  if (isNearLeftEdge) dropdownClasses.push(styles.dropdownRight);

  return(
    <div 
      className={styles.targetContainer} 
      style={{ left: `${x}%`, top: `${y}%` }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className={styles.reticle}></div>
      <ul className={dropdownClasses.join(' ')}>
        
        {/* CONDITION 1: Display a 3-row placeholder list while characters fetch */}
        {isLoading ? (
          [...Array(3)].map((_, index) => (
            <li key={`skeleton-${index}`} className={styles.skeletonItem}>
              <div className={styles.skeletonLine} />
            </li>
          ))
        ) : (
          
          /* CONDITION 2: Render active target choices once database sync resolves */
          characters.map((char) => (
            <li 
              key={char.id} 
              className={styles.dropdownItem} 
              onClick={() => onSelect(char.id, char.name)} 
            >
              {char.name}
            </li>
          ))
        )}
      </ul>
    </div>);
}