import { BrowserRouter, Route, Routes } from 'react-router';
import './App.css';
import Home from './pages/Home'; // Home page component

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} /> {/* Default home page */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
