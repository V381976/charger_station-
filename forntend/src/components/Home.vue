6<template>
  <div class="home-container">
    <h1 class="title"> Charger station </h1> 
    <div class="overlay">
      
      <p class="subtitle">Track. Manage. Optimize your electric charging network with ease.</p>

      <div class="btn-group">
        <router-link to="/login"><button class="nav-btn">🔑 Login</button></router-link>
        <router-link to="/signup"><button class="nav-btn">📝 Sign Up</button></router-link>
        <router-link to="/chargers"><button class="nav-btn">⚙️ Manage Chargers</button></router-link>
        <router-link to="/add"><button class="nav-btn">🗺️  Add New station</button></router-link>
      </div>
    </div>

    <div class="features">
      <div class="feature-card" v-for="feature in features" :key="feature.title">
        <h3>{{ feature.title }}</h3>
        <p>{{ feature.desc }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      features: [
        { title: "📍 Real-Time Tracking", desc: "View live charger locations on map." },
        { title: "🛠️ Easy Management", desc: "Add, edit, or remove charging stations." },
        { title: "🔐 Secure Access", desc: "JWT-based login/signup system." }
      ]
    };
  }
};
</script>

<style scoped>

.title {
  font-size: 48px;
  font-weight: 800;
  text-align: center;
  background: linear-gradient(90deg, #ff6a00, #ee0979);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: fadeInUp 1s ease-in-out;
  margin-bottom: 10px;
  letter-spacing: 1px;
  text-transform: uppercase;
}
  
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.home-container {
  min-height: 100vh;
  background: linear-gradient(to right, #1d4350, #a43931);
  color: white;
  font-family: 'Segoe UI', sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.overlay {
  text-align: center;
  margin-top: 50px;
}


.subtitle {
  font-size: 18px;
  margin-top: 10px;
  max-width: 600px;
  margin: 10px auto 30px;
}

.btn-group {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
  margin-top: 10px;
}

.nav-btn {
  padding: 12px 20px;
  font-size: 16px;
  background-color: white;
  color: #a43931;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.3s;
}

.nav-btn:hover {
  background-color: #ffebee;
  transform: scale(1.05);
}

.features {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 60px;
  gap: 20px;
}

.feature-card {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 20px;
  width: 250px;
  text-align: center;
  backdrop-filter: blur(5px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
}
.feature-card ::hover {
    font-size: 18px;
    box-shadow: 0 6px 16px rgba(33, 85, 34, 0.3);
    transform: translateY(3px);
    transition: 0.9s; 
}
</style>
