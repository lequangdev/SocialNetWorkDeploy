import { createApp } from 'vue'
import App from './App.vue'
import router from "./router/router";
import store from './store/store.js';
import signalR from './services/signalRService.js'



const app = createApp(App)
app.use(store);
app.use(router);


const token = localStorage.getItem("token");
if (token) {
    signalR.startConnection(token);
    signalR.onReceiveMessage((message) => {
        store.commit("updateReceiveMessage", message)
    }) 
}
else{
    router.push("/login")
}

app.mount("#app"); 
