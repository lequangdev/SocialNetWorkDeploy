import { createStore } from 'vuex'; 
import axios from 'axios';
import router from '@/router/router';
import signalR  from '@/services/signalRService';
import { API_URLS } from '@/api/api.url';
import { computed } from 'vue';



const getDefaultState = () => ({
  allUser: [],
  user: {},
  receiveMessage: [],
  listRoom_id: [],
  lisetMessager: [],
  listSearch: [],
  allFriend: [],
  friendInvitation: [],
  notification: {
    message: '',
    type: ''
  },
  postList: [],
  objInforChat: {}
})

const store = createStore({
  state: computed(() => getDefaultState()).value,
  getters: {
    postList: function(state){
      return state.postList
    },
    objInforChat: function(state){
      return state.objInforChat
    },
    notification: function(state){
      return state.notification
    },
    AllUser: function(state){
      return state.allUser
    },
    listSearch: function(state){
      return state.listSearch
    },
    user: function(state){
      return state.user
    },
    receiveMessage: function(state){
      return state.receiveMessage
    },
    listRoom_id: function(state){
      return state.listRoom_id
    },
    lisetMessager: function(state){
      return state.lisetMessager
    },
    allFriend: function(state){
      return state.allFriend
    },
    friendInvitation: function(state){
      return state.friendInvitation
    }
  },
  mutations: {
    RESET_STATE(state) {
      Object.assign(state, getDefaultState())
    },
    setNotification(state, notification){
      state.notification = notification
    },
    updateReceiveMessage: function(state, message){
      state.receiveMessage.push(message)
    },
    getUser(state, user){
      state.user = user
    },
    getListSearch(state, listSearch){
      state.listSearch = listSearch.filter(item => item.user_id !== localStorage.getItem('user_id'));
    }
    ,
    getALLUser(state, allUser){
      state.allUser = allUser.filter(item => item.user_id != localStorage.getItem('user_id'));
    },
    getMessageByRoomId(state, receiveMessage){
      state.receiveMessage = receiveMessage
    },
    getListRoom_id(state, listRoom_id){
      state.listRoom_id = listRoom_id
    },
    getListMessager(state, lisetMessager){
      state.lisetMessager = lisetMessager
    },
    getALLFriendInvitation(state, friendInvitation){
      state.friendInvitation = friendInvitation
    },
    getALLFriend(state, friends){
      state.allFriend = friends
    },
    deleteFriend(state,friend){
      state.allFriend = state.allFriend.filter(
        item => item.user_id !== friend
      );
    },
    deleteFriendInvitation(state, user){
      state.friendInvitation = state.friendInvitation.filter(
        item => item.user_id !== user
      );
    },
    getPostList(state, payload){
      state.postList = payload
    },
    updateObjInforChat(state, payload){
      state.postList = payload
    }
  },
  actions: {
    insertPost(context, payload){
      axios({
        method: 'Post',
        url: API_URLS.INSERT_POST,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        data: payload
      })
      .then(Response => {
        this.dispatch("getPostList")
      })
      .catch(error => {
        console.error('Lỗi:', error);
      });
    },
    getPostList(context){
      axios({
        method: 'Get',
        url: API_URLS.GET_POST_LIST,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      .then( Response => {
          context.commit('getPostList', Response.data)
      })
      .catch(error => {
        console.error('Lỗi:', error);
      });
    },
    registerUser(context ,user){
      axios({
        method: 'Post',
        url: API_URLS.REGISTER,
        data: user
      })
      .then(Response => {
        context.commit('setNotification', {
          message: Response.data.message,
          type: 'success'
        })
      })

      .catch(error => {
        context.commit('setNotification', {
          message: error.response?.data?.message || 'Đăng ký thất bại',
          type: 'error'
        })
      });
    },
    loginUser(context, request){
      axios({
        method: 'Post',
        url: API_URLS.LOGIN,
        data: request
      })
      .then(async Response => {
          localStorage.setItem('token', Response.data.token)
          localStorage.setItem('user_id', Response.data.user.user_id)
          context.commit("getUser", Response.data.user)
          await signalR.startConnection()
          router.push('/')
      })
    },

    CheckedRoomUser(context, payload){
      const user = payload
      axios({
        method: 'Post',
        url: API_URLS.CHECKED_ROOM_USER,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        data: user
      })
      .then(async Response => {
        if(Response.data){ 
          router.push(`/messager/${payload.receiver_id}`)
        }
        else{
          await signalR.createRoomTwo(user)
          router.push(`/messager/${payload.receiver_id}`)
        }
      })
      .catch(error => {
        console.error('Lỗi:', error);
      });
    },

    getALLUser(context){
      axios({
        method: 'Get',
        url: API_URLS.GET_ALL_USER,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      .then(Response => {
          context.commit('getALLUser', Response.data)
      })
      .catch(error => {
        console.error('Lỗi:', error);
      });
    },

    getByUserId(context){
      axios({
        method: 'Get',
        url: API_URLS.GET_USER_BY_ID,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          ID: localStorage.getItem("user_id")
        }
      })
      .then(Response => {
          context.commit('getUser', Response.data)

      })
      .catch(error => {
        console.error('Lỗi:', error);
      });
    },

    getMessageByRoomId(context, payload){
      axios({
        method: 'Get',
        url: API_URLS.GET_MESSAGE_BY_ROOM_ID,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          room_id: payload
        }
      })
      .then(Response => {
         context.commit("getMessageByRoomId", Response.data)
      })
      .catch(error => {
        console.error('Lỗi:', error);
      });
    },

    resetReceiveMessage(context){
      context.commit("getMessageByRoomId", '')
    },

    getListRoom_id(context, user_id){
      axios({
        method: 'Get',
        url: API_URLS.GET_ROOM_BY_USER_ID,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          user_id: user_id
        }
      })
      .then(Response => {
         context.commit("getListRoom_id", Response.data)
      })
      .catch(error => {
        console.error('Lỗi:', error);
      });
    },

    GetRoomWithUsersByRoom_id(context, payload){
      let room_id = payload
      axios({
        method: 'Post',
        url: API_URLS.GET_ROOM_WITH_USERS_BY_ROOM_ID,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        data: room_id
      })
      .then(Response => {
        context.commit("getListMessager",Response.data)
      })
      .catch(error => {
        console.error('Lỗi:', error);
      });
    },
    getListSearch(context, payload){
      axios({
        method: 'Get',
        url: API_URLS.GET_USER_BY_FULLNAME,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          payload: payload
        },
      })
      .then(Response => {
        context.commit("getListSearch",Response.data)
      })
      .catch(error => {
        console.error('Lỗi:', error);
      });
    },
    getALLFriendInvitation(context){
      axios({
        method: 'Get',
        url: API_URLS.GET_ALL_FRIEND_INVITATION,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          id: localStorage.getItem('user_id')
        }
      })
      .then(Response => {
          context.commit('getALLFriendInvitation', Response.data)
      })
      .catch(error => {
        console.error('Lỗi:', error);
      });
    },
    AddFriend(context, model){
      axios({
        method: 'Post',
        url: API_URLS.ADD_FRIEND,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        data: model
      })
      .then(Response => {
        console.error('Thành công');
      })
      .catch(error => {
        console.error('Lỗi:', error);
      });
    },
    getALLFriend(context){
      axios({
        method: 'Get',
        url: API_URLS.GET_ALL_FRIEND,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          id: localStorage.getItem('user_id')
        }
      })
      .then(Response => {
          context.commit('getALLFriend', Response.data)
      })
      .catch(error => {
        console.error('Lỗi:', error);
      });
    },
    pushPage(context, url){
      router.push(url)
    }
  }
});

export default store; 