<template>
  <div class="charger-listing-with-map">
    <!-- 🔒 Logout -->
    <button class="logout-btn" @click="logout">Logout</button>

    <!-- 🌍 Map on Left -->
    <div id="map" class="map"></div>

    <!-- 📋 Listing + Filters + Edit Form -->
    <div class="listing">
      <h2>Charging Stations</h2>

      <!-- 🔍 Filters -->
      <div class="filters">
        <label>Status:
          <select v-model="filters.status">
            <option value="">All</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </label>
        <label>Connector:
          <input v-model="filters.connectorType" placeholder="Type" />
        </label>
        <label>Min Power:
          <input v-model.number="filters.minPower" type="number" min="0" />
        </label>
        <button @click="applyFilters">Apply</button>
        <button @click="clearFilters">Clear</button>
      </div>

      <!-- ✏️ Edit Form -->
      <div v-if="editingCharger" class="edit-form">
        <h3>Edit Charger</h3>
        <form @submit.prevent="updateCharger">
          <label>Name:
            <input v-model="editForm.name" required />
          </label>
          <label>Status:
            <select v-model="editForm.status" required>
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </label>
          <label>Power Output:
            <input type="number" v-model.number="editForm.powerOutput" required />
          </label>
          <label>Connector Type:
            <input v-model="editForm.connectorType" required />
          </label>
          <label>Latitude:
            <input type="number" v-model.number="editForm.location.latitude" required />
          </label>
          <label>Longitude:
            <input type="number" v-model.number="editForm.location.longitude" required />
          </label>
          <div class="form-actions">
            <button type="submit">Update</button>
            <button type="button" @click="cancelEdit">Cancel</button>
          </div>
        </form>
      </div>

      <!-- 📄 Charger List -->
      <ul>
        <li v-for="charger in filteredChargers" :key="charger._id">
          <div>
            <strong>{{ charger.name }}</strong> - {{ charger.status }}, {{ charger.powerOutput }}kW
          </div>
          <div class="actions">
            <button @click="editCharger(charger)">Edit</button>
            <button @click="deleteCharger(charger._id)">Delete</button>
            <button @click="focusCharger(charger)">Map</button>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';

export default {
  data() {
    return {
      chargers: [],
      filteredChargers: [],
      filters: { status: '', connectorType: '', minPower: 0 },
      map: null,
      markersLayer: null,
      markerMap: {},
      editingCharger: null,
      editForm: {
        name: '',
        status: 'Active',
        powerOutput: 0,
        connectorType: '',
        location: {
          latitude: 0,
          longitude: 0
        }
      }
    };
  },
  methods: {
    async fetchChargers() {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/charging-stations', {
        headers: { Authorization: `Bearer ${token}` }
      });
      this.chargers = res.data;
      this.applyFilters();
      this.renderMarkers();
    },
    applyFilters() {
      this.filteredChargers = this.chargers.filter(ch => {
        if (this.filters.status && ch.status !== this.filters.status) return false;
        if (this.filters.connectorType && !ch.connectorType.toLowerCase().includes(this.filters.connectorType.toLowerCase())) return false;
        if (this.filters.minPower && ch.powerOutput < this.filters.minPower) return false;
        return true;
      });
      this.renderMarkers();
    },
    clearFilters() {
      this.filters = { status: '', connectorType: '', minPower: 0 };
      this.applyFilters();
    },
    renderMarkers() {
      if (!this.markersLayer) this.markersLayer = L.layerGroup().addTo(this.map);
      this.markersLayer.clearLayers();
      this.markerMap = {};

      this.filteredChargers.forEach(ch => {
        const marker = L.marker([ch.location.latitude, ch.location.longitude])
          .bindPopup(`<b>${ch.name}</b><br>Status: ${ch.status}`)
          .addTo(this.markersLayer);
        this.markerMap[ch._id] = marker;
      });
    },
    focusCharger(charger) {
      const marker = this.markerMap[charger._id];
      if (marker) {
        this.map.setView([charger.location.latitude, charger.location.longitude],5);
        marker.openPopup();
      }
    },
    logout() {
      localStorage.removeItem('token');
      this.$router.push('/');
    },
    editCharger(charger) {
      this.editingCharger = charger._id;
      this.editForm = { ...charger, location: { ...charger.location } };
    },
    cancelEdit() {
      this.editingCharger = null;
      this.editForm = {
        name: '',
        status: 'Active',
        powerOutput: 0,
        connectorType: '',
        location: { latitude: 0, longitude: 0 }
      };
    },
    async updateCharger() {
      const token = localStorage.getItem('token');
      try {
        await axios.put(`http://localhost:5000/api/charging-stations/${this.editingCharger}`, this.editForm, {
          headers: { Authorization: `Bearer ${token}` }
        });
        this.editingCharger = null;
        this.fetchChargers();
      } catch (err) {
        alert('Error updating charger');
      }
    },
    async deleteCharger(id) {
      const token = localStorage.getItem('token');
      if (confirm('Are you sure?')) {
        await axios.delete(`http://localhost:5000/api/charging-stations/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        this.fetchChargers();
      }
    }
  },
  mounted() {
    this.map = L.map('map').setView([22.9734, 78.6569], 5); // India-centered map
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);
    this.fetchChargers();
  }
};
</script>

<style scoped>
.charger-listing-with-map {
  display: flex;
  gap: 10px;
  position: relative;
}

.map {
  flex: 1;
  height: 750px;
  min-width: 350px;
  border-radius: 8px;
}

.listing {
  flex: 1;
  padding: 20px;
  background: linear-gradient(to right, #1d4350, #a43931);
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
  min-width: 350px;
  color: white;
}

.filters label {
  display: block;
  margin-bottom: 8px;
}

.filters input, .filters select {
  padding: 5px;
  width: 100%;
  margin-top: 4px;
  border-radius: 4px;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  background: white;
  margin: 10px 0;
  padding: 10px;
  border-radius: 6px;
  color: #333;
  box-shadow: 0 0 5px rgba(0,0,0,0.1);
}

.actions button {
  margin-top: 5px;
  margin-right: 8px;
  background-color: rgb(99, 130, 161);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  padding: 5px 10px;
}

.actions button:hover {
  background-color: rgb(89, 96, 198);
}

.logout-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgb(88, 31, 31);
  color: #fff;
  border: none;
  padding: 8px 14px;
  border-radius: 4px;
  cursor: pointer;
  z-index: 999;
}

.logout-btn:hover {
  background: rgb(170, 65, 65);
}

.edit-form {
  background: rgba(255,255,255,0.9);
  padding: 10px;
  border-radius: 8px;
  color: #000;
  margin-bottom: 20px;
}

.edit-form h3 {
  margin-bottom: 10px;
}

.edit-form label {
  display: block;
  margin-bottom: 8px;
}

.edit-form input, .edit-form select {
  width: 100%;
  padding: 6px;
  margin-top: 3px;
  margin-bottom: 10px;
  border-radius: 4px;
  border: 1px solid #ccc;
}

.form-actions {
  display: flex;
  gap: 10px;
}
</style>
