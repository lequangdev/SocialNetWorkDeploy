import { createApp } from 'vue'
import App from './App.vue'
import router from "./router/router";
import store from './store/store.js';
import signalR from './services/signalRService.js'

const app = createApp(App)
const token = localStorage.getItem("token");
console.log("Token:", localStorage.getItem('token'));
if (token) {
    signalR.startConnection(token);
}


app.use(store);
app.use(router);
app.mount("#app"); 