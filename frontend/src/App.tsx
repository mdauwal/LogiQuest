
import { BrowserRouter, Route, Routes } from 'react-router';
import './App.css'
import DummyNav from './DummyNav';
import Home from './dummy-pages/Home';
import Page1 from './dummy-pages/Page1';
import Page2 from './dummy-pages/Page2';

function App() {

  return (
    <>
    <BrowserRouter>
    <DummyNav/>
    <Routes>
      <Route path='/' element={<Home/>} />
      <Route path='/page1' element={<Page1/>} />
      <Route path='/page2' element={<Page2/>} />
      {/* <h1 className="bg-blue-500 text-3xl font-bold underline">Welcome to LogiQuest</h1> */}
      </Routes>
      </BrowserRouter>
    </>
  );
}

export default App
