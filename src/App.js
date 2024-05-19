import React from 'react';
import Header from './Header'; // Import Header component (navigation bar that will display among all pages)
import ReserveParkingSpace from './ReserveParkingSpace';
import MyGoogleMap from './MyGoogleMap';
import './App.css';

function App() {
  return (
  <>
    <div className="App">
      <Header />
      <ReserveParkingSpace />
    </div>
  </>
  );
}

export default App;