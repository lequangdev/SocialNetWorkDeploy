import { createRouter, createWebHistory } from "vue-router";
import signalR from '@/services/signalRService';
const routes = [
  {
    path:"/",
    name:"Home",  
    meta: {
        layout: "home"
    },
    component:  () => import(/* webpackChunkName: "Home" */ "../view/HomeView.vue" ),
  },
  {
    path:"/messager/:id",
    name:"messager/:id",  
    meta: {
      layout: "messager/:id"
    },
    component:  () => import(/* webpackChunkName: "messager/:id" */ "../view/MessagerView.vue" ),
  },
  {
    path:"/messager",
    name:"messager",  
    meta: {
      layout: "messager"
    },
    component:  () => import(/* webpackChunkName: "messager" */ "../view/MessagerView.vue" ),
  },
  {
    path:"/friend",
    name:"friend",  
    meta: {
        layout: "friend"
    },
    component:  () => import(/* webpackChunkName: "friend" */ "../view/FriendView.vue" ),
  },
  {
    path:"/register",
    name:"rigister",  
    meta: {
        layout: "register"
    },
    component:  () => import(/* webpackChunkName: "register" */ "../view/auth/RegisterView.vue" ),
  },{
    path:"/login",
    name:"login",  
    meta: {
        layout: "login"
    },
    component:  () => import(/* webpackChunkName: "login" */ "../view/auth/LoginView.vue" ),
  },
  {
    path:"/profile",
    name:"profile",  
    meta: {
        layout: "profile"
    },
    component:  () => import(/* webpackChunkName: "profile" */ "../view/ProfileView.vue" ),
  },
  {
    path:"/search/:id",
    name:"search",  
    meta: {
        layout: "search"
    },
    component:  () => import(/* webpackChunkName: "searchUser" */ "../view/SearchUserView.vue" ),
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;