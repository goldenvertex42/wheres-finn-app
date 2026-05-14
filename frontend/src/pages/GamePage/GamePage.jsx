import React from 'react';
import { useGameSession } from '../../hooks/useGameSession';
import TargetBox from '../../components/TargetBox/TargetBox';
import GameHeader from '../../components/GameHeader/GameHeader';
import adventureTimeImage from '../../assets/adventureTime.jpg';
import styles from './GamePage.module.css';

export default function GamePage() {
  const {
    isGameActive,
    clickData,
    setClickData,
    remainingCharacters,
    markers,
    displayTime,
    handleSelection,
    clearTargeting
  } = useGameSession();

  const handleImageClick = (e) => {
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
      <div className={styles.imageContainer}>
        {/* Floating Top Widget Bar Overlay */}
        <GameHeader time={displayTime} remainingCount={remainingCharacters.length} />

        <img 
          src={adventureTimeImage} 
          alt="Find all the characters!" 
          onClick={remainingCharacters.length > 0 ? handleImageClick : undefined} 
        />
        
        {markers.map((marker, index) => (
          <div 
            key={`marker-${index}`} 
            className={styles.confirmedMarker} 
            style={{ left: `${marker.relX}%`, top: `${marker.relY}%` }} 
          />
        ))}

        {clickData && remainingCharacters.length > 0 && (
          <TargetBox 
            key={`${clickData.relX}-${clickData.relY}`} 
            x={clickData.relX} 
            y={clickData.relY} 
            characters={remainingCharacters} 
            onSelect={handleSelection}
            isNearRightEdge={clickData.relX > 85}
            isNearLeftEdge={clickData.relX < 15}
            isNearBottomEdge={clickData.relY > 70} 
          />
        )}
      </div>

      {!isGameActive && (
        <div className={styles.winMessage}>You found them all!</div>
      )}
    </div>
  );
}
