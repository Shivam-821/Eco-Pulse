import { useState, useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-control-geocoder/dist/Control.Geocoder.css"; // Import geocoder CSS
import "leaflet-control-geocoder"; // Import geocoder plugin

const useGeocoding = () => {
  const [geocoder, setGeocoder] = useState(null);
  const [ready, setReady] = useState(false);
  const scriptLoaded = useRef(false);

  useEffect(() => {
    // Initialize Leaflet Geocoding service when the component mounts
    if (typeof L !== "undefined" && L.Control.Geocoder) {
      setGeocoder(L.Control.Geocoder.nominatim()); // Use Nominatim for geocoding
      setReady(true);
    } else {
      // Optionally, you can load Leaflet's script dynamically if not already loaded
      if (!scriptLoaded.current) {
        const script = document.createElement("script");
        script.src = "https://unpkg.com/leaflet@1.7.1/dist/leaflet.js";
        script.async = true;
        script.onload = () => {
          setGeocoder(L.Control.Geocoder.nominatim()); // Initialize geocoder
          setReady(true);
        };
        document.head.appendChild(script);
        scriptLoaded.current = true;
      }
    }
  }, []);

  const getLocationName = async (lat, lng) => {
    if (!geocoder) throw new Error("Geocoder not ready yet");

    // Use Leaflet's geocoding API
    return new Promise((resolve, reject) => {
      geocoder.reverse([lat, lng], 10, (results) => {
        if (results && results.length > 0) {
          resolve(results[0].name || "Location not found");
        } else {
          reject("Geocoding failed, no results found.");
        }
      });
    });
  };

  return { getLocationName, ready };
};

export default useGeocoding;
