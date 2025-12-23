<template>
    <FriendLayout><div class="friend_content">
        <h3 class="friend_content-box--title">Bạn bè</h3>
        <div class="friend_content-box">
            <div v-for="(user, index) in friends" :key="index" class="friend_content-box--users">
                <img :src="user.user_avatar" alt="">
                <div class="user_fullName">{{ user.user_fullName }}</div>
                <button v-on:click="chatUser(user.user_id)" class="chat_user">Nhắn tin</button>
                <button @click="deleteFriend(user.user_id)" class="chat_add-friend">Hủy bạn</button>
            </div>
        </div>
        <h3 class="friend_content-box--title">Lời mời kết bạn</h3>
        <div class="friend_content-box">
            <div v-for="(user, index) in friendInvitation" :key="index" class="friend_content-box--users">
                <img :src="user.user_avatar" alt="">
                <div class="user_fullName">{{ user.user_fullName }}</div>
                <button v-on:click="agree(user.user_id)" class="chat_user">Đồng ý</button>
                <button @click="notAgree(user.user_id)" class="chat_add-friend">Hủy</button>
            </div>
        </div>
    </div>
    </FriendLayout>
</template>


<script>
    import FriendLayout from '@/layouts/FriendLayout.vue';
    import { computed, onMounted, ref } from 'vue';
    import { useStore } from 'vuex';
    import signalRService from '@/services/signalRService';
    export default{
        components: {
            FriendLayout,
        },
        setup(){
            const store = useStore()
            const allUser = computed(() => store.state.allUser)
            const user_id = localStorage.getItem('user_id')
            const friendInvitation = computed(() => store.state.friendInvitation)
            const friends = computed(() => store.state.allFriend)
            onMounted(() =>{
                store.dispatch('getALLFriend')
                store.dispatch('getALLFriendInvitation')
                signalRService.receiveFriendship((callback) => {
                    if(callback){
                        store.dispatch('getALLFriendInvitation')
                    }
                })
                signalRService.receiveNotAcceptFriendship(callback => {
                    if(callback){
                        store.dispatch('getALLFriend')
                    }
                })
            })
            function chatUser(param){
                let payload = {
                    user_id: user_id,
                    receiver_id: param
                }
                store.dispatch('CheckedRoomUser', payload)
            }

            async function agree(friend){
                let payload = {
                    user_id: user_id,
                    friend_id: friend
                }
                await signalRService.acceptFriendship(payload)
                store.commit('deleteFriendInvitation', friend)
                await store.dispatch('getALLFriend')
            }

            function notAgree(friend){
                let payload = {
                    user_id: user_id,
                    friend_id: friend
                }
                signalRService.notAcceptFriendship(payload)
                store.commit('deleteFriendInvitation', friend)
                
            }
            function deleteFriend(friend){
                let payload = {
                    user_id: user_id,
                    friend_id: friend
                }
                signalRService.notAcceptFriendship(payload)
                store.commit('deleteFriend', friend)
            }

            return {
                allUser, chatUser, friendInvitation,friends, agree, notAgree, deleteFriend
            }
        }
    }
</script>

<style scoped>
    .friend_content{
        height: calc(100vh - 66px);
        width: 100%;
        flex: 1;
        padding:0 10px;
        background-color: #f1f3f5;
    }
    .friend_content-box{
        display: flex;
        flex-wrap: wrap;
        width: 100%;

    }
    .friend_content-avatar{
        width: 1200px;
        height: 180px;
        padding-left: 50px;
        position: relative;
        display: flex;
        top:-60px;
    }
    .friend_content-avatar img{
        position: absolute;
        width: 180px;
        height: 180px;
        border-radius: 50%;
        border: 5px solid white;
        cursor: pointer;
    }

    .friend_content-box--users{
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
    .friend_content-box--users img{
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
        color: black;
        background-color:rgb(226, 229, 233) ;
    }
    .friend_content-box--title{
        padding: 10px 0;
    }
</style>