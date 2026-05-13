import { useNavigate, useOutletContext } from 'react-router'
import { useState, useEffect } from 'react'
import TargetBox from '../../components/TargetBox/TargetBox'
import adventureTimeImage from '../../assets/adventureTime.jpg'
import styles from './GamePage.module.css'

export default function GamePage() {
  const navigate = useNavigate();
  const { stopVisualTimer } = useOutletContext();
  const [isGameActive, setIsGameActive] = useState(true);
  const [clickData, setClickData] = useState(null);
  const [remainingCharacters, setRemainingCharacters] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [hasFetched, setHasFetched] = useState(false); // Safeguard against early mount trigger

  // 1. Lifecycle Hook: Dynamic target hydration from the database
  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL || '';
    fetch(`${apiUrl}/api/game/characters`)
      .then(res => res.json())
      .then(data => {
        setRemainingCharacters(data);
        setHasFetched(true); // Confirms the data layer has initialized
      })
      .catch(err => {
        console.error("Error loading characters:", err);
        setHasFetched(true); // Prevents infinite hangs on network failures
      });
  }, []);

  // 2. Win-State Trigger Hook: Evaluated safely after database synchronization
  useEffect(() => {
    if (hasFetched && remainingCharacters.length === 0 && isGameActive) {
      setIsGameActive(false);
      stopVisualTimer();
      handleWinSequence();
    }
  }, [remainingCharacters, isGameActive, hasFetched]);

  const handleWinSequence = async () => {
    const apiUrl = import.meta.env.VITE_API_URL || '';
    try {
      // Submit final completion token to Express module
      const response = await fetch(`${apiUrl}/api/game/finish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      
      if (data.success) {
        console.log(`Verified Server Time: ${data.timeMs}ms`);
        // Redirect to leaderboard view, passing the verified time and qualification flag
        setTimeout(() => {
          navigate('/leaderboard', { 
            state: { 
              scoreTimeMs: data.timeMs,
              qualifies: data.qualifies // Injected from your updated finishGame controller
            } 
          });
        }, 1500);
      }
    } catch (error) {
      console.error("Failed to securely verify game completion score:", error);
      navigate('/leaderboard');
    }
  };

  const clearTargeting = () => setClickData(null);

  const handleSelection = async (characterId, characterName) => {
    const apiUrl = import.meta.env.VITE_API_URL || '';
    try {
      // Send user data directly to the Express module validation engine
      const response = await fetch(`${apiUrl}/api/game/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          characterId,
          characterName, 
          userX: clickData.relX, 
          userY: clickData.relY 
        })
      });
      const data = await response.json();

      if (data.hit) {
        // Backend confirmed: save match positions in state as responsive percentage values
        setMarkers(prev => [...prev, { relX: clickData.relX, relY: clickData.relY }]);
        setRemainingCharacters(prev => prev.filter(char => char.id !== characterId));
      } else {
        alert(data.message || "Missed! Try looking closer.");
      }
    } catch (error) {
      console.error("Failed to run click validation request:", error);
    }
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

  return (
    <>
      <div className={styles.gameViewContainer} onClick={clearTargeting}>
        <div className={styles.imageContainer}>
          <img 
            src={adventureTimeImage} 
            alt="Find all the characters!" 
            onClick={remainingCharacters.length > 0 ? handleImageClick : undefined} 
          />
          
          {/* Renders markers safely scaled across responsive browser windows */}
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
              isNearRightEdge={clickData.relX > 65} // Matches right 25% edge boundary
            />
          )}
        </div>

        {!isGameActive && (
          <div className={styles.winMessage}>You found them all!</div>
        )}
      </div>
    </>
  );
}
