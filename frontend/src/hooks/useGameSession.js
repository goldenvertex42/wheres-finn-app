import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';

export function useGameSession() {
  const navigate = useNavigate();
  const [isGameActive, setIsGameActive] = useState(true);
  const [clickData, setClickData] = useState(null);
  const [remainingCharacters, setRemainingCharacters] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [hasFetched, setHasFetched] = useState(false);
  const [displayTime, setDisplayTime] = useState("00:00");

  const startTimeRef = useRef(null);
  const animationFrameRef = useRef(null);
  const apiUrl = import.meta.env.VITE_API_URL || '';

  // Initial target hydration
  useEffect(() => {
    startTimeRef.current = Date.now();
    fetch(`${apiUrl}/api/game/characters`)
      .then(res => res.json())
      .then(data => {
        setRemainingCharacters(data);
        setHasFetched(true);
      })
      .catch(err => {
        console.error("Error loading characters:", err);
        setHasFetched(true);
      });

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [apiUrl]);

  // High-performance visual stopwatch loop
  useEffect(() => {
    if (!isGameActive || !hasFetched) return;

    const updateTimer = () => {
      const elapsedMs = Date.now() - startTimeRef.current;
      const totalSeconds = Math.floor(elapsedMs / 1000);
      const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
      const seconds = String(totalSeconds % 60).padStart(2, '0');
      
      setDisplayTime(`${minutes}:${seconds}`);
      animationFrameRef.current = requestAnimationFrame(updateTimer);
    };

    animationFrameRef.current = requestAnimationFrame(updateTimer);
    return () => cancelAnimationFrame(animationFrameRef.current);
  }, [isGameActive, hasFetched]);

  // Win-State Evaluator
  useEffect(() => {
    if (hasFetched && remainingCharacters.length === 0 && isGameActive) {
      setIsGameActive(false);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      
      // Fire victory submission
      fetch(`${apiUrl}/api/game/finish`, { method: 'POST' })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setTimeout(() => {
              navigate('/leaderboard', { 
                state: { scoreTimeMs: data.timeMs, qualifies: data.qualifies } 
              });
            }, 1500);
          }
        })
        .catch(() => navigate('/leaderboard'));
    }
  }, [remainingCharacters, isGameActive, hasFetched, navigate, apiUrl]);

  const handleSelection = async (characterId, characterName) => {
    try {
      const response = await fetch(`${apiUrl}/api/game/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ characterId, characterName, userX: clickData.relX, userY: clickData.relY })
      });
      const data = await response.json();

      if (data.hit) {
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

  const clearTargeting = () => setClickData(null);

  return {
    isGameActive,
    clickData,
    setClickData,
    remainingCharacters,
    markers,
    displayTime,
    handleSelection,
    clearTargeting
  };
}
