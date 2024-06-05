import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './Header'; // Import Header component (navigation bar that will display among all pages)
import ReserveParkingSpace from './ReserveParkingSpace';
import ParkingAvailability from './ParkingAvailability';
import Login from './Login';
import CreateAccount from './CreateAccount';
import MyGoogleMap from './MyGoogleMap';
import './App.css';
import { ParkingProvider } from './ParkingContext';
import WelcomePage from './WelcomePage';
import ManageParking from './ManageParking';

function App() {
  return (
    <Router>
      <ParkingProvider>
        <div className="App">
          <Header />
          <Routes>
            <Route path="/" element={<WelcomePage />}/>
            <Route path="/Login" element={<Login />}/>
            <Route path="/CreateAccount" element={<CreateAccount />}/>
            <Route path="/ReserveParkingSpace" element={<ReserveParkingSpace />}/>
            <Route path="/ParkingAvailability" element={<ParkingAvailability />}/>
            <Route path="/ManageParking" element={<ManageParking />}/>
          </Routes>
        </div>
      </ParkingProvider>
    </Router>
  );
}

export default App;