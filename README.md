ParkAhead: A UW Bothell Parking Spot Reservation System
<strong>Developed By: David Schurer and Shivam Bakshi</strong>

## Overview
ParkAhead is a parking spot reservation system designed for UW Bothell faculty and students. It is a fully functioning web application that allows users to reserve parking spots on campus, view parking availability in real-time, and manage their reservations. The system is built with a React.js frontend and utilizes Firebase for database management and user authentication.

## Live Website
<strong>https://park-ahead.vercel.app/</strong>

## Features
- Integrated with Firebase Authentication to allow users to create and login with their own accounts and manage their accounts such as changing the account email address or account password.
  
- A seamless and intuitive 2-step reservation process that allows users to reserve a parking spot in advance and choose key reservation details such as booking name, date, duration (2-hour / 4-hour / all-day), time, and parking location.
  
- A dynamic parking layout that shows users all of the parking spots available to reserve per level in each parking garage. The real-time system shows users which parking spots have already been reserved, preventing reservation conflicts and additionally has a filtering feature to show parking spots by category (Handicap/Electric/Standard).
  
- Real-time reservation management which allows users to view all current and future parking reservations in the system while the system fetches and dynamically displays all of the reservations that have been reserved. Old parking reservations will be deleted from the system, and users have the ability to delete their parking reservations as well as add and delete vehicles from their account and edit their profile settings such as name, student ID, and graduation year.

- An arrival confirmation page with an internal timer implemented which commences on the start time on the reservation date of the specific reservation reserved giving the user 10 minutes to confirm their arrival or deleting the reservation from the database if the user does not confirm their reservation.

## Tech Stack
- <strong>Frontend:</strong> React.js, HTML, CSS
- <strong>Backend:</strong> Firebase Database, Firebase Authentication
- <strong>Deployment:</strong> Vercel
