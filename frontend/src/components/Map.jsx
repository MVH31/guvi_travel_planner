import React, { useState, useEffect, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker, Polyline } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px',
  borderRadius: '8px',
  marginBottom: '2rem',
};

const Map = ({ dailyPlan }) => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  });

  const [pathCoordinates, setPathCoordinates] = useState([]);
  const [map, setMap] = useState(null);

  const onLoad = useCallback(function callback(map) {
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback(map) {
    setMap(null);
  }, []);

  useEffect(() => {
    if (!dailyPlan || dailyPlan.length === 0) return;

    // Get a list of unique cities from the plan to avoid duplicate API calls
    const uniqueCities = [...new Set(dailyPlan.map(day => day.city))];

    const fetchAllCoordinates = async () => {
      // Create an array of promises, one for each geocoding request
      const promises = uniqueCities.map(city => {
        const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(city)}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`;
        return fetch(geocodeUrl).then(res => res.json());
      });

      try {
        const results = await Promise.all(promises);
        const coordinatesMap = {};
        
        results.forEach((data, index) => {
          if (data.status === 'OK' && data.results.length > 0) {
            const location = data.results[0].geometry.location;
            coordinatesMap[uniqueCities[index]] = location;
          }
        });

        // Create the final path in the correct order of the daily plan
        const newPath = dailyPlan.map(day => coordinatesMap[day.city]).filter(Boolean);
        setPathCoordinates(newPath);

      } catch (error) {
        console.error('Error fetching coordinates for the route:', error);
      }
    };

    fetchAllCoordinates();
  }, [dailyPlan]); // Re-run when the plan changes

  // Auto-zoom the map to fit all markers
  useEffect(() => {
    if (map && pathCoordinates.length > 1) {
      const bounds = new window.google.maps.LatLngBounds();
      pathCoordinates.forEach(coord => {
        bounds.extend(new window.google.maps.LatLng(coord.lat, coord.lng));
      });
      map.fitBounds(bounds);
    }
  }, [map, pathCoordinates]);


  if (!isLoaded) {
    return <div style={containerStyle}>Loading map...</div>;
  }

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={pathCoordinates[0] || { lat: 20.5937, lng: 78.9629 }} // Default center
      zoom={pathCoordinates.length <= 1 ? 11 : 4} // Default zoom
      onLoad={onLoad}
      onUnmount={onUnmount}
    >
      {/* Draw a marker for each coordinate */}
      {pathCoordinates.map((coord, index) => (
        <Marker key={index} position={coord} />
      ))}
      
      {/* Draw a line connecting the markers */}
      {pathCoordinates.length > 1 && (
        <Polyline
          path={pathCoordinates}
          options={{
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
          }}
        />
      )}
    </GoogleMap>
  );
};

export default React.memo(Map);