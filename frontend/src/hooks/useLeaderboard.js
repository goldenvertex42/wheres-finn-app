import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';

export function useLeaderboard() {
  const location = useLocation();
  const navigate = useNavigate(); 
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // Extract navigation parameters safely
  const [scoreTimeMs] = useState(location.state?.scoreTimeMs);
  const [qualifiesForBoard] = useState(location.state?.qualifies);
  const apiUrl = import.meta.env.VITE_API_URL || '';

  // Explicit safety check: verifies if visit is an authenticated victory sequence
  const isEligibleSubmission = scoreTimeMs !== undefined && qualifiesForBoard === true;

  useEffect(() => {
    if (location.state !== null) {
      // Wipes the background history node so browser page refreshes remain clean
      navigate('/leaderboard', { replace: true, state: null });
    }
  }, [location.state, navigate]);

  // Fetch scoreboard array from backend engine
  useEffect(() => {
    fetch(`${apiUrl}/api/leaderboard`)
      .then(res => res.json())
      .then(data => {
        setLeaderboardData(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Scoreboard synchronization crash:", err);
        setIsLoading(false);
      });
  }, [hasSubmitted, apiUrl]);

  const handleSubmitScore = async (e) => {
    e.preventDefault();
    if (!username.trim()) return;

    try {
      const response = await fetch(`${apiUrl}/api/leaderboard`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, timeMs: scoreTimeMs })
      });
      
      if (response.ok) {
        setHasSubmitted(true);
      }
    } catch (err) {
      console.error("Failed to persist high score:", err);
    }
  };

  return {
    leaderboardData,
    isLoading,
    scoreTimeMs,
    isEligibleSubmission,
    hasSubmitted,
    username,
    setUsername,
    handleSubmitScore
  };
}
