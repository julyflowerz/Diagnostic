import React, { useState, useEffect, useCallback } from 'react';

const MechanicFinder = () => {
  const [mechanics, setMechanics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState('');

  // Calculate distance between two coordinates in miles
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 3959; // Earth's radius in miles
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Get user's current location
  const getUserLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      return;
    }

    setLoading(true);
    setLocationError('');
    setError('');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lon: longitude });
        fetchNearbyMechanics(latitude, longitude);
      },
      (error) => {
        setLoading(false);
        switch(error.code) {
          case error.PERMISSION_DENIED:
            setLocationError('Location permission is required to find nearby mechanic shops.');
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError('Location information is unavailable.');
            break;
          case error.TIMEOUT:
            setLocationError('Location request timed out.');
            break;
          default:
            setLocationError('An unknown error occurred while getting location.');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  }, []);

  // Fetch nearby mechanics using OpenStreetMap Overpass API
  const fetchNearbyMechanics = async (lat, lon) => {
    const radius = 8000; // 5 miles in meters

    const query = `
      [out:json][timeout:25];
      (
        node["shop"="car_repair"](around:${radius},${lat},${lon});
        way["shop"="car_repair"](around:${radius},${lat},${lon});
        node["amenity"="vehicle_inspection"](around:${radius},${lat},${lon});
        way["amenity"="vehicle_inspection"](around:${radius},${lat},${lon});
        node["craft"="mechanic"](around:${radius},${lat},${lon});
        way["craft"="mechanic"](around:${radius},${lat},${lon});
      );
      out center tags;
    `;

    try {
      const response = await fetch("https://overpass-api.de/api/interpreter", {
        method: "POST",
        body: query,
        headers: {
          "Content-Type": "text/plain"
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch mechanic data');
      }

      const data = await response.json();
      processMechanicData(data.elements, lat, lon);
    } catch (err) {
      setError('Failed to find nearby mechanics. Please try again.');
      setLoading(false);
    }
  };

  // Process and format mechanic data
  const processMechanicData = (elements, userLat, userLon) => {
    const processedMechanics = elements.map((element, index) => {
      // Get coordinates (for nodes, use lat/lon; for ways, use center)
      const lat = element.lat || element.center?.lat;
      const lon = element.lon || element.center?.lon;
      
      if (!lat || !lon) return null;

      const distance = calculateDistance(userLat, userLon, lat, lon);
      
      // Format address
      const address = [];
      if (element.tags?.['addr:housenumber']) address.push(element.tags['addr:housenumber']);
      if (element.tags?.['addr:street']) address.push(element.tags['addr:street']);
      if (element.tags?.['addr:city']) address.push(element.tags['addr:city']);
      if (element.tags?.['addr:postcode']) address.push(element.tags['addr:postcode']);
      
      const fullAddress = address.length > 0 ? address.join(', ') : 'Address not available';
      
      return {
        id: element.id || index,
        name: element.tags?.name || 'Unnamed Mechanic Shop',
        address: fullAddress,
        phone: element.tags?.phone || element.tags?.['contact:phone'] || 'Phone not available',
        distance: `${distance.toFixed(1)} miles`,
        distanceValue: distance,
        lat: lat,
        lon: lon,
        tags: element.tags || {}
      };
    }).filter(Boolean); // Remove null entries

    // Sort by distance
    processedMechanics.sort((a, b) => a.distanceValue - b.distanceValue);
    
    setMechanics(processedMechanics);
    setLoading(false);
  };

  const handleGetDirections = (mechanic) => {
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${mechanic.lat},${mechanic.lon}`;
    window.open(mapsUrl, "_blank");
  };

  // Auto-search when component mounts
  useEffect(() => {
    getUserLocation();
  }, [getUserLocation]);

  return (
    <div className="pixel-card h-100">
      <h2>NEARBY MECHANICS</h2>
      
      <div className="mb-4">
        <button 
          className="retro-button w-100"
          onClick={getUserLocation}
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="diagnostic-loading me-2"></span>
              FINDING NEARBY SHOPS...
            </>
          ) : (
            '📍 USE MY LOCATION'
          )}
        </button>
      </div>

      {locationError && (
        <div className="alert alert-warning retro-alert mb-3">
          ⚠️ {locationError}
        </div>
      )}

      {error && (
        <div className="alert alert-danger retro-alert mb-3">
          ERROR: {error}
        </div>
      )}

      {userLocation && !locationError && (
        <div className="small-text text-muted mb-3">
          📍 Searching within 5 miles of your location...
        </div>
      )}

      <div className="mechanics-list">
        {mechanics.length > 0 && (
          <div className="section-title mb-3" style={{ color: 'var(--retro-amber)', fontSize: '0.8rem' }}>
            FOUND {mechanics.length} NEARBY SHOPS
          </div>
        )}
        
        {mechanics.map(mechanic => (
          <div key={mechanic.id} className="mechanic-card p-3 border border-retro-border rounded mb-3">
            <div className="d-flex justify-content-between align-items-start mb-2">
              <div className="flex-grow-1">
                <h5 className="mb-1" style={{ color: 'var(--retro-green)' }}>
                  {mechanic.name}
                </h5>
                <div className="small-text text-muted">
                  📍 {mechanic.distance} away
                </div>
              </div>
            </div>
            
            <div className="mb-2">
              <div className="small-text">
                📍 {mechanic.address}
              </div>
              <div className="small-text">
                📞 {mechanic.phone}
              </div>
            </div>
            
            <button 
              className="retro-button small"
              onClick={() => handleGetDirections(mechanic)}
            >
              🗺️ GET DIRECTIONS
            </button>
          </div>
        ))}
      </div>

      {mechanics.length === 0 && !loading && !locationError && !error && userLocation && (
        <div className="text-center text-muted mt-4">
          <div className="mb-3">🔧</div>
          <p>No nearby mechanic shops found. Try increasing the search radius.</p>
        </div>
      )}

      {!userLocation && !locationError && !loading && (
        <div className="text-center text-muted mt-4">
          <div className="mb-3">�</div>
          <p>Click "Use My Location" to find nearby mechanic shops</p>
        </div>
      )}
    </div>
  );
};

export default MechanicFinder;
