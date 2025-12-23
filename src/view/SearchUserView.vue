<template>
    <SearchUserLayout>
        <div class="SearchUser_content">
            <h3 class="SearchUser_content-box--title">Mọi người</h3>
            <div class="SearchUser_content-box">
                <div v-for="(user, index) in listUserSearch" :key="index" class="SearchUser_content-box--users">
                    <img :src="user.user_avatar" alt="">
                    <div class="user_fullName">{{ user.user_fullName }}</div>
                    <button v-on:click="chatUser(user.user_id)" class="chat_user">Nhắn tin</button>
                    <button @click="addFriend(user.user_id)" class="chat_add-friend">Thêm bạn</button>
                </div>
            </div>
        </div>
    </SearchUserLayout>
    
</template>

<script>
    import SearchUserLayout from '@/layouts/SearchUserLayout.vue';
    import { computed, onMounted, ref } from 'vue';
    import { useStore } from 'vuex';
    import signalRService from '@/services/signalRService';
    export default{
        components: {
            SearchUserLayout
        },
        setup(){
            const store = useStore()
            const allUser = computed(() => store.state.allUser)
            const user_id = localStorage.getItem('user_id')
            const listUserSearch = computed(() => store.state.listSearch)
            onMounted(() =>{
                store.dispatch('getALLUser')
            })
            function chatUser(param){
                let payload = {
                    user_id: user_id,
                    receiver_id: param
                }
                store.dispatch('CheckedRoomUser', payload)
            }
            function addFriend(friend){
                let payload = {
                    user_id: user_id,
                    friend_id: friend
                }
                signalRService.sendFriend(payload)
            }

            return {
                allUser, chatUser, listUserSearch, addFriend
            }
        }
    }
</script>

<style scoped>
    .SearchUser_content{
        height: calc(100vh - 66px);
        width: 100%;
        flex: 1;
        padding:0 10px;
        background-color: #f1f3f5;
    }
    .SearchUser_content-box{
        display: flex;
        flex-wrap: wrap;
        width: 100%;

    }
    .SearchUser_content-avatar{
        width: 1200px;
        height: 180px;
        padding-left: 50px;
        position: relative;
        display: flex;
        top:-60px;
    }
    .SearchUser_content-avatar img{
        position: absolute;
        width: 180px;
        height: 180px;
        border-radius: 50%;
        border: 5px solid white;
        cursor: pointer;
    }

    .SearchUser_content-box--users{
        display: flex;
        height: 200px;
        width: 180px;
        background-color: white;
        align-items: center;
        flex-direction: column;
        border-radius: 10px;
        padding: 10px;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
        margin: 8px;
    }
    .SearchUser_content-box--users img{
        width: 60px;
        height: 60px;
        border-radius: 50%;
    }
    .user_fullName{
        font-weight: 600;
        padding: 5px;
    }
    .chat_user{
        height: 34px;
        width: 120px;
        border: none;
        border-radius: 10px;
        cursor: pointer;
        margin: 5px;
        color: white;
        background-color: #0866ff;
    }
    .chat_add-friend{
        height: 34px;
        width: 120px;
        border: none;
        border-radius: 10px;
        cursor: pointer;
        margin: 5px;
        color: white;
        background-color:rgb(66, 183, 42) ;
    }
    .SearchUser_content-box--title{
        padding: 10px 0;
    }
</style>
