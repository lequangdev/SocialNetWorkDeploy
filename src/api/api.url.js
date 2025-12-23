const API_BASE = "http://localhost:5100";

export const API_URLS = {

    LOGIN: `${API_BASE}/api-auth/auth/Login`,
    REGISTER: `${API_BASE}/api-auth/auth/Register`,
    CHECKED_ROOM_USER: `${API_BASE}/api-chat/Chat/RoomUser`,
    GET_ALL_USER: `${API_BASE}/api-auth/AuthUser/GetAll`,
    GET_USER_BY_ID: `${API_BASE}/api-auth/AuthUser/GetByID`,
    GET_MESSAGE_BY_ROOM_ID: `${API_BASE}/api-chat/Chat/GetMessage`,
    GET_ROOM_BY_USER_ID: `${API_BASE}/api-chat/Chat/GetRoomByUser_id`,
    GET_ROOM_WITH_USERS_BY_ROOM_ID: `${API_BASE}/api-chat/Chat/GetRoomWithUsersByRoom_id`,
    GET_USER_BY_FULLNAME: `${API_BASE}/api-auth/AuthUser/GetUserByFullname`,
    GET_ALL_FRIEND_INVITATION: `${API_BASE}/api-auth/Friendship/GetFriendInvitationByUser_id`,
    ADD_FRIEND: `${API_BASE}/api-auth/Friendship/AddFriend`,
    GET_ALL_FRIEND: `${API_BASE}/api-auth/Friendship/GetFriendByUser_id`,
    SIGNALR_URL: `${API_BASE}/hubs/chat`,
};
