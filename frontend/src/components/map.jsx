import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axios from "axios";
import dayjs from 'dayjs'

// Marker icons
const redIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const orangeIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const blueIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function Map() {
  const [userLocation, setUserLocation] = useState({
    lat: 24.7938,
    lon: 93.9491,
  }); // Default: Imphal
  const [dumpLocations, setDumpLocations] = useState([]);

  // Dummy data for smart bins
  const smartBinData = [
    {
      name: "Imphal East",
      lat: 24.8035,
      lon: 93.9505,
      status: "Full",
      teamAssigned: true,
      time: "2025-04-23 09:00 AM",
      icon: redIcon,
    },
    {
      name: "Imphal West",
      lat: 24.7877,
      lon: 93.9444,
      status: "Nearly Full",
      teamAssigned: false,
      time: "2025-04-23 08:30 AM",
      icon: orangeIcon,
    },
    {
      name: "Ukhrul",
      lat: 24.7082,
      lon: 94.0833,
      status: "Reported",
      teamAssigned: false,
      time: "2025-04-23 07:45 AM",
      icon: blueIcon,
    },
  ];

  useEffect(() => {
    // Get current user location
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lon: longitude });
      },
      (error) => console.error("Geolocation error:", error)
    );

    // Fetch dumps from backend
    const fetchDumps = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/dump/getall-dump`
        );
        const dumps = res.data.data || [];

        const formattedDumps = dumps.map((dump) => ({
          lat: dump.location.coordinates[1],
          lon: dump.location.coordinates[0],
          description: dump.description,
          uniqueNumber: dump.uniqueNumber,
          reporter:
            dump.dumpReporter?.fullname ||
            dump.dumpReporter?.username ||
            "Unknown",
          picture: dump.picture || "",
          icon: blueIcon,
          team: dump.teamAssigned === false ? "No" : "Yes",
          reportedAt: dayjs(dump.createdAt).format("YYYY-MM-DD hh:mm A"),
        }));

        setDumpLocations(formattedDumps);
      } catch (error) {
        console.error("Failed to fetch dump data:", error);
      }
    };

    fetchDumps();
  }, []);

  return (
    <div className="map-page">
      <div
        className="map-container"
        style={{ marginTop: "10vh", marginLeft: "240px", height: "50vh" }}
      >
        <MapContainer
          center={[24.7938, 93.9491]}
          zoom={10}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {/* Admin location marker */}
          <Marker
            position={[userLocation.lat, userLocation.lon]}
            icon={redIcon}
          >
            <Popup>
              You are here!
              <br />
              Location: Imphal
            </Popup>
          </Marker>

          {/* Smart bin dummy data */}
          {smartBinData.map((location, index) => (
            <Marker
              key={`bin-${index}`}
              position={[location.lat, location.lon]}
              icon={location.icon}
            >
              <Popup>
                <strong>Location:</strong> {location.name}
                <br />
                <strong>Status:</strong> {location.status}
                <br />
                <strong>Team Assigned:</strong>{" "}
                {location.teamAssigned ? "Yes" : "No"}
                <br />
                <strong>Time:</strong> {location.time}
              </Popup>
            </Marker>
          ))}

          {/* Registered Dumps */}
          {dumpLocations.map((dump, index) => (
            <Marker
              key={`dump-${index}`}
              position={[dump.lat, dump.lon]}
              icon={dump.icon}
            >
              <Popup>
                <strong>Reported by:</strong> {dump.reporter}
                <br />
                <strong>Description:</strong> {dump.description}
                <br />
                <strong>Unique Number:</strong> {dump.uniqueNumber}
                <br />
                <strong>Team Assigned:</strong> {dump.team}
                <br />
                <strong>Reported At:</strong> {dump.reportedAt}
                <br />
                {dump.picture && (
                  <img src={dump.picture} alt="Dump" width="100" />
                )}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
