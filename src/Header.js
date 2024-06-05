import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

function Header() {
    return (
        <div className="header">
            <h1>UW Bothell Parking Spot Reservation System</h1>
            <nav>
                <ul>
                    <li><Link to="/ReserveParkingSpace">Reserve Parking Space</Link></li>
                    <li><Link to="/ParkingAvailability">Check Parking Space Availability</Link></li>
                    <li><Link to="/ManageParking">Manage Parking Reservations</Link></li>
                </ul>
            </nav>
        </div>
    );
}

export default Header;