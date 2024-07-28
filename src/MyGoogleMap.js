import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '600px'
};

const center = {
  lat: 47.7601, // Approximate center of UW Bothell campus
  lng: -122.1908
};

const NorthGarage = {
  id: 3,
  name: "North Garage",
  lat: 47.699127,
  lng: -122.293750,
  info: "Information about North Garage"
};

const spots = [
  { id: 1, name: "Spot 1", lat: 47.7601, lng: -122.1908, info: "Information about Spot 1" },
  { id: 2, name: "Spot 2", lat: 47.7605, lng: -122.1910, info: "Information about Spot 2" },
  { id: 3, name: "North Garage", lat: 47.699127, lng: -122.293750, info: "Information about North Garage" }
];

const MyGoogleMap = () => {
  const [selectedSpot, setSelectedSpot] = React.useState(null);
  const [selectedParkingLot, setSelectedParkingLot] = useState('');

  const handleParkingLotClick = (parkingLot) => {
    setSelectedParkingLot(parkingLot);
    setSelectedSpot(null);
  };

  return (
    <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={16}
      >
{spots.map(spot => (
  <Marker
    key={spot.id}
    position={{ lat: spot.lat, lng: spot.lng }}
    onClick={() => setSelectedSpot(spot)}
  />
))}
<Marker
  key="TEST"
  position={{ lat: 47.7864, lng: -122.2071 }} // Coordinates of the UW Bothell football field
  onClick={() => setSelectedSpot({ name: "TEST", info: "This is the TEST marker." })}
>
  <div style={{ background: "red", borderRadius: "50%", width: "30px", height: "30px" }} />
</Marker>
{selectedSpot && (
  <InfoWindow
    position={{ lat: selectedSpot.lat, lng: selectedSpot.lng }}
    onCloseClick={() => setSelectedSpot(null)}
  >
    <div>
      <h2>{selectedSpot.name}</h2>
      <p>{selectedSpot.info}</p>
    </div>
  </InfoWindow>
)}
        {selectedParkingLot === 'North Garage' && (
          <InfoWindow
            position={{ lat: NorthGarage.lat, lng: NorthGarage.lng }}
            onCloseClick={() => setSelectedParkingLot(null)}
          >
            <div>
              <h2>{NorthGarage.name}</h2>
              <p>{NorthGarage.info}</p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
  );
}

export default MyGoogleMap;