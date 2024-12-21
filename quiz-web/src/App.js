import './App.css';
import { BrowserRouter as Router, Routes, Route , NavLink  } from 'react-router-dom';
import Home from './pages/home/Home';
import LeaderBoard from './pages/leaderboard/LeaderBoard';
import Header from './components/header/Header';
import Footer from './components/footer/Footer';


const RouteRender = () => {
  return (
    <Router>
      <nav>
        <ul>
          <li><NavLink exact="true" to="/" className={(navData) => (navData.isActive ? "active-style" : 'none')}>Home</NavLink></li>
          <li><NavLink to="/leaderboard" className={(navData) => (navData.isActive ? "active-style" : 'none')}>Leaderboard</NavLink></li>
        </ul>
      </nav>

      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/leaderboard" element={<LeaderBoard />} />
      </Routes>
    </Router>
  );
}
function App() {
  return (
      <div className="App">
        <Header />
        <RouteRender />
        <Footer />
      </div>
  );
}

export default App;
