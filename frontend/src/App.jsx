import { Outlet } from 'react-router';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import './App.css';

function App() {
  return (
    <div className='app-container'>
      <Header /> 
      <main>
        <Outlet /> 
      </main>
      <Footer />
    </div>
  );
}

export default App;
