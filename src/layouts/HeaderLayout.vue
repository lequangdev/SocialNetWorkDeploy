<template>
    <div class="container_header">
        <div class="container_header-logo">
            <img src="@/assets/logo.png" alt="">
        </div>
        <div class="container_header-title">Social network</div>
        <div class="container_header-search">
            <div class="container_header-search--input"><input @keyup.enter="searchUser()" v-model="inputSearch" type="text" placeholder="Tìm kiếm"></div>
            <div @click="searchUser()" class="container_header-search--button"><button ><i class="fa-solid fa-magnifying-glass"></i></button></div>
        </div>
        <div class="container_header-category">
            <div class="container_header-category--addbox container_header-category--mold" placeholder="Add box" title="Tạo box chat"><i class="fa-solid fa-people-group"></i></div>
            <div class="container_header-category--messager container_header-category--mold" placeholder="Messager" title="Messager"><i class="fa-solid fa-comment"></i></div>
            <div class="container_header-category--Notification container_header-category--mold" placeholder="Notification" title="Thông báo"><i class="fa-solid fa-bell"></i></div>
            <div @click="turnPage('login')" class="container_header-category--account container_header-category--mold">
                <img :src="user.user_avatar" alt="" class="avatar">
                <div class="container_header-category--menu">
                    <div  @click="turnPage('/profile')" class="personal_page">Trang cá nhân</div>
                    <div @click="logout" class="logout">Đăng xuất</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { useRouter } from 'vue-router';
    import store from '@/store/store';
    import signalR from '@/services/signalRService';
    import { computed, ref } from 'vue';
    export default{
        setup(){
            let router = useRouter();
            let user = computed(() => store.state.user)
            let inputSearch = ref('')
            function turnPage(param){
                if(localStorage.getItem('token') != undefined){
                    router.push('profile')
                }
                else{
                    router.push(param)
                }
            }

            async function logout(){
                localStorage.removeItem('token')
                localStorage.removeItem('user')
                localStorage.removeItem('user_id')
                await signalR.stopConnection();
                router.push('login')
                console.log('xóa')
            }

            function searchUser(){
                if(inputSearch.value.trim()){
                    store.dispatch('getListSearch', inputSearch.value.trim())
                    router.push(`/search/${inputSearch.value.trim()}`)
                }
            }

            return {
                turnPage, logout, user, inputSearch, searchUser
            }
        }
    }
</script>

<style scoped>
    .container_header{
        display: flex;
        height: 56px;
        width: 100%;
        position: fixed;
        background-color: white;
        top: 0;
        left: 0;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.02);
    }
    .container_header-logo {
        display: inline-block;
    }
    .container_header-logo img {
        width: 40px;
        height: 40px;
        margin: 8px 16px;
        border-radius: 10px;
    }
    .container_header-title{
        min-width: 160px;
        font-family: Arial, Helvetica, sans-serif;
        font-size: 24px;
        line-height: 56px;
        color: #f06aa7;
    }
    .container_header-search{
        display: flex;
        margin: 8px auto;
    }
    .container_header-search--input{
        padding-left: 20px;
        background-color: #f7f8fa;
        border-radius: 20px 0 0 20px;
        border: 1px solid #bdbdbd;
    }
    .container_header-search--input input {
        width: 500px;
        height: 38px;
        padding: 8px;
        outline: none;
        border: 1px;
        background-color: #f7f8fa;
        border-radius: 20px 0 0 20px;
        font-size: 15px;
    }
    .container_header-search--button button {
        border: none;
        height: 40px;
        width: 60px;
        background-color: #f7f8fa;
        border-radius: 0 20px 20px 0;
        cursor: pointer;
        border-right: 1px solid #bdbdbd;
        border-top: 1px solid #bdbdbd;
        border-bottom: 1px solid #bdbdbd;
    }

    .container_header-category{
        display: flex;
        padding: 0 16px;
    }
    .container_header-category--mold{
        display: block;
        width: 40px;
        height: 40px;
        margin: auto 0;
        text-align: center;
        cursor: pointer;
        background-color: #f7f8fa;
        border-radius: 50%;
        margin: 6px;
    }
    .container_header-category--mold i {
        font-size: 20px;
        line-height: 40px;
    }

    .container_header-category--account:hover .container_header-category--menu{
        display: block;
    }

    .container_header-category--account .avatar{
        width: 40px;
        height: 40px;
        border-radius: 50%;
    }

    .container_header-category--menu{
        width: 200px;   
        position: relative;
        background-color: #f06aa7;
        left: -150px;
        padding: 10px 0;
        border-radius: 5px;
        display: none;
    }

    .container_header-category--menu div {
        padding: 10px;
        font-weight: 600;
        color: white;
    }
    .container_header-category--menu div:hover {
        background-color: #f099c0;
    }




</style>
