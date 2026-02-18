import { useState, useEffect } from 'react';

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  isLoading: boolean;
  error: string | null;
  isPermissionDenied: boolean;
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    isLoading: true,
    error: null,
    isPermissionDenied: false,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setState({
        latitude: null,
        longitude: null,
        isLoading: false,
        error: 'Geolocation is not supported by your browser',
        isPermissionDenied: false,
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          isLoading: false,
          error: null,
          isPermissionDenied: false,
        });
      },
      (error) => {
        const isPermissionDenied = error.code === error.PERMISSION_DENIED;
        setState({
          latitude: null,
          longitude: null,
          isLoading: false,
          error: error.message,
          isPermissionDenied,
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      }
    );
  }, []);

  return state;
}
