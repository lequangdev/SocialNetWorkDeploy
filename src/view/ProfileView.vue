<template>
    <ProfileLayout>
        <div class="profile_content">
            <div class="profile_content-background"><img src="@/assets/logo.png" class="background"></div>
            <div class="profile_content-boxUser">
                <div class="profile_content-avatar"><img :src="user.user_avatar" alt=""></div>
                <div class="profile_content-userName"><span>{{ user.user_fullName}}</span></div>
            </div>
        </div>
    </ProfileLayout>
    
</template>

<script>
    import store from '@/store/store';
    import ProfileLayout from '@/layouts/ProfileLayout.vue';
    export default{
        components: {
            ProfileLayout
        },
        setup(){
            const user = store.state.user
            
            return {
                user
            }
        }
    }
</script>

<style scoped>
    .profile_content-userName{
        padding: 10px;
        font-size: 32px;
        font-weight: 600;
    }
    .profile_content-boxUser{
        display: flex;
    }
    .profile_content{
        padding:0 10px;
        background-color: #f1f3f5;
    }
    .profile_content-background{
        width: 1200px;
        height: 450px;
        overflow: hidden;
        
    }
    .profile_content-background img {
        width: 1200px;
    }
    .profile_content-avatar{
        width: 180px;
        height: 180px;
        margin-left: 50px;
        position: relative;
        display: flex;
        top:-60px;
    }
    .profile_content-avatar img{
        display: block;
        position: absolute;
        width: 180px;
        height: 180px;
        border-radius: 50%;
        border: 5px solid white;
        cursor: pointer;
        
    }
</style>
