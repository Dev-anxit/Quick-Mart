declare global {
  interface Window {
    google: any;
  }
}

/**
 * Load Google Maps script
 */
export async function loadGoogleMapsScript(apiKey: string): Promise<boolean> {
  return new Promise((resolve) => {
    // Check if already loaded
    if (window.google?.maps) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,marker`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
}

/**
 * Initialize Places Autocomplete for address input
 */
export function initPlacesAutocomplete(
  inputElement: HTMLInputElement,
  onPlaceSelect: (place: any) => void
): google.maps.places.Autocomplete | null {
  if (!window.google?.maps?.places) {
    console.error('Google Maps Places API not loaded');
    return null;
  }

  const autocomplete = new window.google.maps.places.Autocomplete(inputElement, {
    types: ['geocode'],
    componentRestrictions: { country: 'in' },
  });

  autocomplete.addListener('place_changed', () => {
    const place = autocomplete.getPlace();

    if (!place.geometry) {
      console.error('Place has no geometry');
      return;
    }

    const addressComponents = place.address_components;
    const address = {
      street: '',
      city: '',
      pincode: '',
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
      fullAddress: place.formatted_address,
    };

    // Parse address components
    addressComponents?.forEach((component: any) => {
      const types = component.types;

      if (types.includes('street_number')) {
        address.street += component.long_name + ' ';
      }
      if (types.includes('route')) {
        address.street += component.long_name;
      }
      if (types.includes('locality')) {
        address.city = component.long_name;
      }
      if (types.includes('postal_code')) {
        address.pincode = component.long_name;
      }
    });

    onPlaceSelect(address);
  });

  return autocomplete;
}

/**
 * Initialize Google Map with marker
 */
export function initMap(
  mapElement: HTMLDivElement,
  lat: number,
  lng: number,
  title: string
): google.maps.Map {
  const map = new window.google.maps.Map(mapElement, {
    center: { lat, lng },
    zoom: 15,
  });

  new window.google.maps.Marker({
    position: { lat, lng },
    map,
    title,
  });

  return map;
}

/**
 * Animate marker movement on map
 */
export function animateMarker(
  map: google.maps.Map,
  marker: google.maps.Marker,
  targetLat: number,
  targetLng: number,
  duration: number = 1000
): void {
  const startLat = marker.getPosition()?.lat() || 0;
  const startLng = marker.getPosition()?.lng() || 0;

  const startTime = Date.now();

  const animate = () => {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);

    const lat = startLat + (targetLat - startLat) * progress;
    const lng = startLng + (targetLng - startLng) * progress;

    marker.setPosition({ lat, lng });
    map.panTo({ lat, lng });

    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  };

  animate();
}

/**
 * Get user's current location
 */
export function getCurrentLocation(): Promise<{ lat: number; lng: number }> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        reject(new Error(`Geolocation error: ${error.message}`));
      }
    );
  });
}

/**
 * Reverse geocode coordinates to address
 */
export async function reverseGeocode(
  lat: number,
  lng: number
): Promise<string | null> {
  if (!window.google?.maps?.Geocoder) {
    console.error('Google Maps Geocoder not loaded');
    return null;
  }

  const geocoder = new window.google.maps.Geocoder();

  return new Promise((resolve) => {
    geocoder.geocode(
      { location: { lat, lng } },
      (results: any[], status: any) => {
        if (status === 'OK' && results[0]) {
          resolve(results[0].formatted_address);
        } else {
          resolve(null);
        }
      }
    );
  });
}
