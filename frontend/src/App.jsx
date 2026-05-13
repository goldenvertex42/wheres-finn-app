import { Outlet } from 'react-router'
import { useState, useEffect } from 'react'
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import './App.css'

function App() {
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [time, setTime] = useState(0);

  useEffect(() => {
    let interval;

    if (isTimerActive) {
      const startTime = Date.now() - (time * 1000); // Resume from current time if needed

      interval = setInterval(() => {
        const now = Date.now();
        // Calculate seconds elapsed and update state
        setTime(Math.floor((now - startTime) / 1000));
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isTimerActive]);

  const stopVisualTimer = () => setIsTimerActive(false);
  return (
    <div className='app-container'>
      <Header time={Number(time)} />
      <main>
        <Outlet context={{ setIsTimerActive, setTime, stopVisualTimer }} />
      </main>
      <Footer />
    </div>
  )
}

export default App
