import { useState } from 'react'
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
  const [clickData, setClickData] = useState(null);
  const [remainingCharacters, setRemainingCharacters] = useState(INITIAL_CHARACTERS);

  const clearTargeting = () => setClickData(null);

  const handleSelection = (characterName) => {
    console.log(`User selected ${characterName} at coordinates:`, clickData);
    
    // 1. (Future) Send clickData.relX, clickData.relY to backend to verify
    
    // 2. Placeholder Logic: Assume the user is always correct for now
    setRemainingCharacters(prev => prev.filter(char => char.name !== characterName));
    
    // 3. Close targeting box
    setClickData(null);
  };

  const handleImageClick = (e) => {
    console.log("Image clicked!")
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
          onClick={handleImageClick} 
        />
        {clickData && (
          <TargetBox
            key={`${clickData.relX}-${clickData.relY}`} 
            x={clickData.relX} 
            y={clickData.relY} 
            characters={remainingCharacters}
            onSelect={handleSelection} 
          />
        )}
      </div>
    </div>
    </>
  );
}