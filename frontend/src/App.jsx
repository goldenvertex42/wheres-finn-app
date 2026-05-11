import { Outlet } from 'react-router'
import { useState } from 'react'
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import './App.css'

function App() {
  const [isTimerActive, setIsTimerActive] = useState(false);
  
  const stopVisualTimer = () => {
    setIsTimerActive(false);
  };

  return (
    <div className='app-container'>
      <Header isTimerActive={isTimerActive} />
      <main>
        <Outlet context={{ setIsTimerActive, stopVisualTimer }} />
      </main>
      <Footer />
    </div>
  )
}

export default App
