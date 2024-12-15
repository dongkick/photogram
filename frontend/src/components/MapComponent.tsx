import React, { useEffect } from 'react';

interface MapComponentProps {
  latitude: number;
  longitude: number;
}

const MapComponent: React.FC<{ latitude: number; longitude: number }> = ({ latitude, longitude }) => {
  useEffect(() => {
    const loadGoogleMapsApi = () => {
      if (!window.google) {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`;
        script.async = true;
        script.defer = true;
        script.onload = () => initMap();
        document.body.appendChild(script);
      } else {
        initMap();
      }
    };

    const initMap = () => {
      const map = new window.google.maps.Map(document.getElementById('map') as HTMLElement, {
        center: { lat: latitude, lng: longitude },
        zoom: 10,
      });

      new window.google.maps.Marker({
        position: { lat: latitude, lng: longitude },
        map,
      });
    };

    loadGoogleMapsApi();
  }, [latitude, longitude]);

  return <div id="map" style={{ width: '100%', height: '400px' }}></div>;
};

export default MapComponent;