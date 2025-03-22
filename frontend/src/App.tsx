import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './pages/Home'; // Home page component
import LandingPage from './components/HeroSection ';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path='/' element={<LandingPage />} /> */}
        <Route path='/' element={<Home />} /> {/* Default home page */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
