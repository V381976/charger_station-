<template>
  <div class="add-station">
    <h2>Add Charging Station</h2>

    <form @submit.prevent="saveCharger">
      <div class="form-group">
        <label for="name">Station Name:</label>
        <input id="name" v-model="form.name" type="text" required />
      </div>

      <div class="form-group">
        <label for="latitude">Latitude:</label>
        <input id="latitude" v-model.number="form.location.latitude" type="number" step="any" required />
      </div>

      <div class="form-group">
        <label for="longitude">Longitude:</label>
        <input id="longitude" v-model.number="form.location.longitude" type="number" step="any" required />
      </div>

      <div class="form-group">
        <label for="status">Status:</label>
        <select id="status" v-model="form.status" required>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      <div class="form-group">
        <label for="powerOutput">Power Output (kW):</label>
        <input id="powerOutput" v-model.number="form.powerOutput" type="number" required />
      </div>

      <div class="form-group">
        <label for="connectorType">Connector Type:</label>
        <input id="connectorType" v-model="form.connectorType" type="text" required />
      </div>

      <button type="submit">Save Station</button>
    </form>

    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      form: {
        name: '',
        location: { latitude: 0, longitude: 0 },
        status: 'Active',
        powerOutput: 0,
        connectorType: ''
      },
      error: ''
    };
  },
  methods: {
    async saveCharger() {
      const token = localStorage.getItem('token');
      if (!token) {
        this.$router.push('/chargers');
        return;
      }
      try {
        await axios.post('http://localhost:5000/api/charging-stations', this.form, {
          headers: { Authorization: `Bearer ${token}` }
        });
        this.$router.push('/chargers');
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to save station';
      }
    }
  }
};
</script>

<style scoped>
.add-station {
  max-width: 600px;
  margin: 30px auto;
  padding: 20px;
  box-shadow: 0 0 10px #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;
}

h2 {
  text-align: center;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
}

label {
  font-weight: 600;
  margin-bottom: 5px;
}

input,
select {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  margin-top: 10px;
  padding: 10px 15px;
  background-color: #1976d2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #1565c0;
}

.error {
  color: red;
  margin-top: 10px;
  text-align: center;
}
</style>
