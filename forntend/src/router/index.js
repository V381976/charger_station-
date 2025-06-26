import { createRouter, createWebHistory } from 'vue-router';
import Login from '../components/Login.vue';
import signup from '../components/signup.vue';
import ChargerListing from '../components/ChargerListing.vue';
import Home from '../components/Home.vue';
import AddStation from '../components/AddStation.vue';

const routes = [
  { path: '/', component: Home },
  { path: '/signup', component: signup },
  { path: '/Login', component: Login },
  { path: '/chargers', component: ChargerListing },
  { path: '/add', component: AddStation },  
 
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;

