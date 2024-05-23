import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './Header'; // Import Header component (navigation bar that will display among all pages)
import ReserveParkingSpace from './ReserveParkingSpace';
import ParkingAvailability from './ParkingAvailability';
import MyGoogleMap from './MyGoogleMap';
import './App.css';
import { ParkingProvider } from './ParkingContext';

function App() {
  return (
    <Router>
      <ParkingProvider>
        <div className="App">
          <Header />
          <Routes>
            <Route path="/" element={<ReserveParkingSpace />}/>
            <Route path="/ParkingAvailability" element={<ParkingAvailability />} />
          </Routes>
        </div>
      </ParkingProvider>
    </Router>
  );
}

export default App;