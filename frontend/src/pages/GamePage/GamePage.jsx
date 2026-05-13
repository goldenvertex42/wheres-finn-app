import { useNavigate, useOutletContext } from 'react-router'
import { useState, useEffect } from 'react'
import TargetBox from '../../components/TargetBox/TargetBox'
import adventureTimeImage from '../../assets/adventureTime.jpg'
import styles from './GamePage.module.css'

const INITIAL_CHARACTERS = [
  { id: 'finn', name: 'Finn' },
  { id: 'jake', name: 'Jake' },
  { id: 'bubblegum', name: 'Princess Bubblegum' },
  { id: 'rainicorn', name: 'Lady Rainicorn' },
  { id: 'marceline', name: 'Marceline' },
  { id: 'iceking', name: 'Ice King' },
  { id: 'lsp', name: 'Lumpy Space Princess' },
  { id: 'peppermint', name: 'Peppermint Butler' },
];

export default function GamePage() {
  const navigate = useNavigate();
  const { stopVisualTimer } = useOutletContext();

  const [isGameActive, setIsGameActive] = useState(true);
  const [clickData, setClickData] = useState(null);
  const [remainingCharacters, setRemainingCharacters] = useState(INITIAL_CHARACTERS);
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    if (remainingCharacters.length === 0 && isGameActive) {
      setIsGameActive(false);
      stopVisualTimer();
      
      setTimeout(() => {
        navigate('/leaderboard');
      }, 1500);
    }
  }, [remainingCharacters, isGameActive, stopVisualTimer, navigate]);

  const clearTargeting = () => setClickData(null);

  const handleSelection = async (characterName) => {
    const apiUrl = import.meta.env.VITE_API_URL;

    try {
      // Send the user input data directly to the Express module controller
      const response = await fetch(`${apiUrl}/api/game/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          characterName,
          userX: clickData.relX,
          userY: clickData.relY
        })
      });

      const data = await response.json();

      if (data.hit) {
        // Backend confirmed! Remove character from local track list
        setMarkers(prev => [...prev, { relX: clickData.relX, relY: clickData.relY }]);
        setRemainingCharacters(prev => prev.filter(char => char.name !== characterName));
      } else {
        // Simple fallback alerts until you style a proper floating prompt
        alert(data.message || "Missed! Try looking closer.");
      }
    } catch (error) {
      console.error("Failed to run click validation request:", error);
    }

    // Shut down context menu instantly
    setClickData(null);
  };

  const handleImageClick = (e) => {
    e.stopPropagation();
    const rect = e.target.getBoundingClientRect();

    const xCoord = e.clientX - rect.left;
    const yCoord = e.clientY - rect.top;

    const xPercent = (xCoord / rect.width) * 100;
    const yPercent = (yCoord / rect.height) * 100;

    setClickData({
      relX: Number(xPercent.toFixed(2)),
      relY: Number(yPercent.toFixed(2))
    });
  };

  return(
    <>
    <div className={styles.gameViewContainer} onClick={clearTargeting}>
      <div className={styles.imageContainer}>
        <img 
          src={adventureTimeImage} 
          alt="Find all the characters!" 
          onClick={remainingCharacters.length > 0 ? handleImageClick : undefined} 
        />
        {markers.map((marker, index) => (
          <div
            key={`marker-${index}`}
            className={styles.confirmedMarker}
            style={{
              left: `${marker.relX}%`,
              top: `${marker.relY}%`,
            }}
          />
        ))}
        {clickData && remainingCharacters.length > 0 && (
          <TargetBox
            key={`${clickData.relX}-${clickData.relY}`} 
            x={clickData.relX} 
            y={clickData.relY} 
            characters={remainingCharacters}
            onSelect={handleSelection}
            isNearRightEdge={clickData.relX > 65}  
          />
        )}
      </div>
      {remainingCharacters.length === 0 && (
        <div className={styles.winMessage}>You found them all!</div>
      )}
    </div>
    </>
  );
}