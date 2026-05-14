import { useState } from 'react';
import { useGameSession } from '../../hooks/useGameSession';
import TargetBox from '../../components/TargetBox/TargetBox';
import GameHeader from '../../components/GameHeader/GameHeader';
import adventureTimeImage from '../../assets/adventureTime.jpg';
import styles from './GamePage.module.css';

export default function GamePage() {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  
  const {
    isGameActive,
    clickData,
    setClickData,
    remainingCharacters,
    markers,
    misses,
    isShaking,
    displayTime,
    handleSelection,
    clearTargeting
  } = useGameSession(isImageLoaded);

  const isInterfaceReady = isImageLoaded && remainingCharacters !== undefined && remainingCharacters !== null;

  const handleImageClick = (e) => {
    if (!isInterfaceReady) return;
    e.stopPropagation();
    const rect = e.target.getBoundingClientRect();
    const xPercent = ((e.clientX - rect.left) / rect.width) * 100;
    const yPercent = ((e.clientY - rect.top) / rect.height) * 100;

    setClickData({ 
      relX: Number(xPercent.toFixed(2)), 
      relY: Number(yPercent.toFixed(2)) 
    });
  };

  return (
    <div className={styles.gameViewContainer} onClick={clearTargeting}>
      <div className={`${styles.imageContainer} ${isShaking ? styles.shakeContainer : ''}`}>
        {/* Render full-page loading spinner if image has not resolved yet */}
        {!isInterfaceReady && (
          <div className={styles.mapLoadingOverlay}>
            <div className={styles.spinner} />
            <div className={styles.loadingText}>Downloading Game Scene...</div>
          </div>
        )}
        
        {/* Floating Top Widget Bar Overlay */}
        {isInterfaceReady && (
          <GameHeader time={displayTime} remainingCount={remainingCharacters.length} />
        )}

        <img 
          src={adventureTimeImage} 
          alt="Find all the characters!"
          onLoad={() => setIsImageLoaded(true)}  
          onClick={remainingCharacters.length > 0 ? handleImageClick : undefined} 
        />
        
        {isInterfaceReady && markers.map((marker, index) => (
          <div 
            key={`marker-${index}`} 
            className={styles.confirmedMarker} 
            style={{ left: `${marker.relX}%`, top: `${marker.relY}%` }} 
          >
            ✓ {/* Added structural visual checkmark text symbol */}
          </div>
        ))}

        {isInterfaceReady && misses.map((miss) => (
          <div 
            key={miss.id} 
            className={styles.missMarker} 
            style={{ left: `${miss.relX}%`, top: `${miss.relY}%` }} 
          >
            ✕
          </div>
        ))}

        {isInterfaceReady && clickData && remainingCharacters.length > 0 && (
          <TargetBox 
            key={`${clickData.relX}-${clickData.relY}`} 
            x={clickData.relX} 
            y={clickData.relY} 
            characters={remainingCharacters} 
            onSelect={handleSelection}
            isNearRightEdge={clickData.relX > 85}
            isNearLeftEdge={clickData.relX < 15}
            isNearBottomEdge={clickData.relY > 55} 
          />
        )}
      </div>

      {!isGameActive && (
        <div className={styles.winMessage}>You found them all!</div>
      )}
    </div>
  );
}
