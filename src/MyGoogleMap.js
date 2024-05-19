import React from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '600px'
};

const center = {
  lat: 47.7601, // Approximate center of UW Bothell campus
  lng: -122.1908
};

const spots = [
  { id: 1, name: "Spot 1", lat: 47.7601, lng: -122.1908, info: "Information about Spot 1" },
  { id: 2, name: "Spot 2", lat: 47.7605, lng: -122.1910, info: "Information about Spot 2" },
  // Add more spots as needed
];

const MyGoogleMap = () => {
  const [selectedSpot, setSelectedSpot] = React.useState(null);

  return (
    <LoadScript googleMapsApiKey="AIzaSyBLGTzQ5FLSclQbpSjS8ohP6WDvKi0di7U">
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
      </GoogleMap>
    </LoadScript>
  );
}

export default MyGoogleMap;