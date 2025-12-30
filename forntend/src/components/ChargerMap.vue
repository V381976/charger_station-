<template>
  <div id="map" style="height: 500px; width: 100%;"></div>
</template>

<script>
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default {
  name: "ChargerMap",
  props: {
    stations: {
      type: Array,
      required: true,
    },
  },
  mounted() {
    const map = L.map("map").setView([27.0238, 74.2179], 6);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);

    this.stations.forEach((station) => {
      if (station.latitude && station.longitude) {
        L.marker([station.latitude, station.longitude])
          .addTo(map)
          .bindPopup(`
            <b>${station.name}</b><br>
            Power: ${station.powerOutput} kW<br>
            Connector: ${station.connectorType}
          `);
      }
    });

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        L.marker([lat, lng], {
          title: "You are here",
        })
          .addTo(map)
          .bindPopup("<b>Your Location</b>")
          .openPopup();

        map.setView([lat, lng], 13);
      });
    }
  },
};
</script>


<style scoped>
/* Default (Desktop / Laptop) */
#map {
  height: 500px;
  width: 100%;
}

/* Tablet */
@media (max-width: 1024px) {
  #map {
    height: 420px !important;
  }
}

/* Mobile */
@media (max-width: 768px) {
  #map {
    height: 350px !important;
    border-radius: 8px;
  }
}

/* Small Mobile */
@media (max-width: 480px) {
  #map {
    height: 300px !important;
    border-radius: 6px;
  }
}

/* Leaflet container styling */
.leaflet-container {
  border-radius: 10px;
  box-shadow: 0 0 10px #aaa;
}
</style>


