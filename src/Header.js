import React from 'react';
import './Header.css';

function Header() {
    return (
        <div className="header">
            <h1>UW Bothell Parking Spot Reservation System</h1>
            <nav>
                <ul>
                    <li><a href="#">Reserve Parking Space</a></li>
                    <li><a href="#">Check Parking Space Availability</a></li>
                    <li><a href="#">Manage Parking Reservations</a></li>
                </ul>
            </nav>
        </div>
    );
}

export default Header;