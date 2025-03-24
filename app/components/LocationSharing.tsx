import React, { useState, useEffect } from 'react';
import { MapPin, Compass, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LocationSharingProps {
  onShareLocation: (location: {
    latitude: number;
    longitude: number;
    address?: string;
  }) => void;
  onCancel: () => void;
}

export const LocationSharing: React.FC<LocationSharingProps> = ({
  onShareLocation,
  onCancel,
}) => {
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
    address?: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getCurrentLocation = () => {
    setIsLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          
          // Get address using reverse geocoding
          const response = await fetch(
            `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${process.env.NEXT_PUBLIC_GEOCODING_API_KEY}`
          );
          
          const data = await response.json();
          const address = data.results[0]?.formatted;
          
          setLocation({ latitude, longitude, address });
        } catch (error) {
          console.error('Error getting address:', error);
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        } finally {
          setIsLoading(false);
        }
      },
      (error) => {
        setError('Could not get your location. Please check your permissions.');
        setIsLoading(false);
        console.error('Geolocation error:', error);
      }
    );
  };

  const handleShare = () => {
    if (location) {
      onShareLocation(location);
    }
  };

  return (
    <div className="p-4 bg-background border rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold mb-4">Share Location</h3>
      
      <div className="space-y-4">
        {error && (
          <div className="p-3 bg-destructive/10 text-destructive rounded-md text-sm">
            {error}
          </div>
        )}

        {location ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4" />
              <span>
                {location.address || 
                  `${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`}
              </span>
            </div>
            
            <div className="aspect-video relative rounded-lg overflow-hidden">
              <img
                src={`https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/pin-s+ff0000(${location.longitude},${location.latitude})/${location.longitude},${location.latitude},14/800x400@2x?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`}
                alt="Location Map"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        ) : (
          <Button
            onClick={getCurrentLocation}
            disabled={isLoading}
            className="w-full"
          >
            <Compass className="w-4 h-4 mr-2" />
            {isLoading ? 'Getting location...' : 'Get Current Location'}
          </Button>
        )}

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            onClick={handleShare}
            disabled={!location || isLoading}
          >
            <Send className="w-4 h-4 mr-2" />
            Share Location
          </Button>
        </div>
      </div>
    </div>
  );
}; 