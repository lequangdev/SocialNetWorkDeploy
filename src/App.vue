<template>
  <div class="social">
      <RouterView></RouterView>
  </div>
</template>

<script>
import axios from "axios";
import { onMounted, ref } from "vue";
import store from "./store/store";
export default {
  setup(){
    const user_id = localStorage.getItem("user_id");
    onMounted(() => {
      store.dispatch('getByUserId')
    })
    
  }
}
</script>

<style scoped>
/* Your styling */
</style>
