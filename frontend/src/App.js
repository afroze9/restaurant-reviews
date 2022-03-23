import { useState } from 'react';
import { Routes, Route, BrowserRouter as Router } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import AddReview from './components/AddReview';
import Login from './components/Login';
import Restaurant from './components/Restaurant';
import RestaurantList from './components/RestaurantList';
import Navbar from './components/Navbar';

function App() {
  const [user, setUser] = useState(null);

  const login = async (user = null) => {
    setUser(user);
  }

  const logout = async () => {
    setUser(null);
  }

  return (
    <Router>
      <Navbar user={user} logout={logout} />
      <div>
        <Routes>
          {["/", "/restaurants"].map(path => (
            <Route
              key={path}
              exact path={path}
              element={<RestaurantList />}
            />
          ))}
          <Route path="/restaurants/:id" element={<Restaurant user={user} />} />
          <Route path="/restaurants/:id/review" element={<AddReview user={user} />} />
          <Route path="/login" element={<Login login={login} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
