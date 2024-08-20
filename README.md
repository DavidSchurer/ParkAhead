# <strong>ParkAhead: <i>A UW Bothell Parking Spot Reservation System</i></strong> <br/> <sub><strong>Developed By:</strong> David Schurer and Shivam Bakshi</sub>

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

## Instructions
Instructions on how to use ParkAhead: A UW Bothell Parking Spot Reservation System:

1) Navigate to the live website link at https://park-ahead.vercel.app/. <br/>
   (NOTE: This application is accessible on both PCs and mobile devices)
       
2) Upon navigating to the Vercel link, the user will be introduced to the application via the welcome page,
   after reading through the brief overview of ParkAhead, the user can press the "Continue" button to navigate
   to the next page.

3) The user will now be prompted with the login page. The user can either login with an existing ParkAhead account or
   create a new account.

4) After successfully logging into the ParkAhead system, the user will be greeted with the homepage screen. The user can view and
   add new vehicles/reservations by clicking the "Add Vehicle" or "Add Reservation" button on this homepage, they can also additionally
   edit their profile information by clicking the "Edit" button underneath the profile section.

5) The user can click on the circular drop down menu icon on the far right side of the header bar, this will open up a dropdown menu showcasing
   various different options, such as for navigating back to the homepage, reserving a new parking space, confirming the arrival of the parking spot,
   viewing all of the confirmed reservations in the system, navigating to the settings page, and logging out from ParkAhead.
