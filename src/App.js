import Home from './pages/Home'
import './App.css';
import { Routes , Route } from 'react-router-dom';
import AddRecord from './pages/AddRecord'
function App() {
  return (
    <div className="App">

        <Routes>

        <Route 
            element={<Home />} path='/'
          />
          <Route 
            element={<AddRecord />} path='/addRecord'
          />
        </Routes>
    </div>
  );
}

export default App;
