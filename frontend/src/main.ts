import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import './assets/styles/base.css';
import './assets/styles/tailwind.css'; 
import './assets/styles/variables.css'; 
import '@fortawesome/fontawesome-free/css/all.css'; 

const app = createApp(App);
const pinia = createPinia();

app.use(router);
app.use(pinia);
app.mount('#app');