<template>
    <MessagerLayout>
        <div class="message_content">
            <div class="message_content-rom">
                <div v-if="objInforChat.user_id.value !== ''" class="message_content-header">
                    <img :src="objInforChat.user_avatar.value" alt="">
                    <div class="message_content-header-tag">
                        <span class="message_content-header-name">{{objInforChat.user_fullName.value}}</span>
                        <span class="message_content-header-status">Đang hoạt động</span>
                    </div>
                </div>
                <div class="message_content-rom--conversation">
                    <div v-for="(msg, index) in receiveMessage" :key="index" class="conversation_body">
                        <div v-if="msg.user_id !== user_id && msg.user_id == objInforChat.user_id.value" class="conversation_body-incomingMessage conversation_body-message">
                            <img class="conversation_body-incomingMessage--avatar " :src="objInforChat.user_avatar.value" alt="">
                            <span class="conversation_body-message--content bgrrece">
                                <span>{{objInforChat.user_fullName.value }}</span>
                                <p v-if="msg.message_type === 'text'">{{ msg.message_content }}</p>
                                <img v-else-if="msg.message_type === 'image'" :src="msg.message_content" alt="Image" style="max-width: 200px; border-radius: 8px;" />
                                <video
                                    v-else-if="msg.message_type === 'video'"
                                    controls
                                    style="max-width: 300px; border-radius: 8px; margin-top: 5px;"
                                    :src="msg.message_content"
                                ></video>
                                <a
                                    v-else-if="msg.message_type === 'file'"
                                    :href="msg.message_content"
                                    target="_blank"
                                    download
                                    style="display: inline-block; margin-top: 5px; color: #1976d2; text-decoration: underline;"
                                >
                                    📎 Tải tệp: {{ getFileName(msg.message_content) }}
                                </a>
                                <p v-else>Không hỗ trợ định dạng tin nhắn này</p>
                            </span>
                        </div>
                        <div v-if="msg.user_id === user_id" class="conversation_body-sentMessage conversation_body-message">
                            <span class="conversation_body-message--content bgrsent">
                                <span>{{user.user_fullName }}</span>
                                <p v-if="msg.message_type === 'text'">{{ msg.message_content }}</p>
                                <img v-else-if="msg.message_type === 'image'" :src="msg.message_content" alt="Image" style="max-width: 200px; border-radius: 8px;" />
                                <video
                                    v-else-if="msg.message_type === 'video'"
                                    controls
                                    style="max-width: 300px; border-radius: 8px; margin-top: 5px;"
                                    :src="msg.message_content"
                                ></video>
                                <a
                                    v-else-if="msg.message_type === 'file'"
                                    :href="msg.message_content"
                                    target="_blank"
                                    download
                                    style="display: inline-block; margin-top: 5px; color: #1976d2; text-decoration: underline;"
                                >
                                    📎 Tải tệp: {{ getFileName(msg.message_content) }}
                                </a>
                                <p v-else>Không hỗ trợ định dạng tin nhắn này</p>
                            </span>
                            <img class="conversation_body-sentMessage--avatar" :src="user.user_avatar" alt="">
                        </div>
                    </div>
                    <div ref="bottomMessage"></div>
                </div>
                <div v-if="objInforChat.room_id.value" class="message_content-rom--input">
                    <div class="message_content-rom-attached">
                        <i class="fa-regular fa-face-smile"></i>
                        <label for="fileInput">
                            <i class="fa-regular fa-image"></i>
                        </label>
                        <label for="fileInput">
                            <i class="fa-solid fa-paperclip"></i>
                        </label>
                        <input @change="handleFileChange" type="file" accept="image/*,video/*,.pdf,.doc,.zip,.txt" hidden id="fileInput" />
                    </div>
                    <div class="message_content-rom--send">
                        <input v-model="inputMessage" @keyup.enter="sendMessage()" type="text" placeholder="Nhập tin nhắn của bạn tới @">
                        <i @click="sendMessage()" class="fa-solid fa-paper-plane"></i>
                    </div>
                </div>
            </div>
            <div class="message_content-list">
                <input v-model="inputSearchChat" type="text" class="form-control" placeholder="Tìm kiếm message" aria-label="Username" aria-describedby="addon-wrapping">
                <div  @click="connectReceiver(room)" v-for="(room) in filteredFormattedListMessager" :key="room.room_id"  class="message_content-account message_content-mold"><img :src="room.user_avatar" alt="" class="avatar"><span class="message_content-describe">{{ room.user_fullName }}</span></div>
            </div>
        </div>
    </MessagerLayout>
</template>

<script>
    import MessagerLayout from '@/layouts/MessagerLayout.vue';
    import { useRouter, useRoute } from 'vue-router';
    import signalR from '@/services/signalRService';
    import store from '@/store/store';
    import { onMounted, ref, computed, onUnmounted, onBeforeMount, watch, nextTick  } from 'vue';
    import { uploadToCloudinary } from '@/cloudinary/cloudinaryService'; 
    export default{
        components: {
            MessagerLayout
        },
        setup(){
            // property
            const bottomMessage = ref(null)
            const router = useRouter()
            const route = useRoute()
            const inputMessage = ref('');
            const receiveMessage = computed(() => store.state.receiveMessage)
            const user_id = localStorage.getItem("user_id");
            const fileData = ref(null)
            const inputSearchChat = ref('')
            const oJtype = {
                text: 'text',
                file: 'file',
                image: 'image',
                video: 'video'
            }
            let listRoom_id = computed(() => store.state.listRoom_id)
            let listMessager = computed(() => store.state.lisetMessager)
            let user = computed(() => store.state.user);
            let messageType = oJtype.text
            let objInforChat = {
                user_id: ref(''),
                user_fullName: ref(''),
                user_avatar: ref(''),
                room_id:ref('') 
            }
            let joinedRoomIds = new Set()
            let uploadToCloud = ref('')
            
            function handleFileChange(event) {
                const file = event.target.files[0]
                if (!file) return;

                fileData.value = file;
                inputMessage.value = file.name;

                if (file.type.startsWith("image/")) {
                    messageType = oJtype.image;
                } else if (file.type.startsWith("video/")) {
                    messageType = oJtype.video;
                } else {
                    messageType = oJtype.file; 
                }
            }
            async function uploadFile(){
                if (!fileData.value) return null;
                let cloudType = "raw"; 
                let folderName = "file_socical";
                if (messageType === oJtype.image) {
                    cloudType = "image";
                    folderName = "img_socical"
                }
                else if (messageType === oJtype.video) {
                    cloudType = "video";
                    folderName = "video_socical"
                }

                return await uploadToCloudinary(fileData.value, folderName, cloudType);
            }
            function getFileName(url) {
                try {
                    return decodeURIComponent(url.split('/').pop().split('?')[0]);
                } catch {
                    return 'unknown_file';
                }
            }
            const formattedListMessager = computed(() => {
                return listMessager.value.map(room => {
                    const otherUser = room.users.find(u => u.user_id !== user_id);
                    return {
                        room_id: room.room_id,
                        user_id: otherUser?.user_id || "",
                        user_fullName: otherUser?.user_fullName || "No name",
                        user_avatar: otherUser?.user_avatar || "",
                    };
                });
            });

            const filteredFormattedListMessager = computed(() => {
                if (!inputSearchChat.value.trim()) {
                    return formattedListMessager.value;
                }
                const keyword = inputSearchChat.value.toLowerCase().trim();
                return formattedListMessager.value.filter(room =>
                    room.user_fullName.toLowerCase().includes(keyword)
                );
            });


            // method
            onMounted( async () => {       
                getListRoom_id()
                signalR.onReceiveRoom(() => {
                    getListRoom_id()
                })
                autoConnectReceiverFromRoute()
            })
            onUnmounted(async () => {
                await store.dispatch("resetReceiveMessage")
            })
            function autoConnectReceiverFromRoute() {
                watch(
                    [() => route.params.id, () => formattedListMessager.value],
                    ([newId, list]) => {
                    if (newId && list.length > 0) {
                        const targetRoom = list.find(room => room.user_id === newId);
                        if (targetRoom) {
                        connectReceiver(targetRoom);
                        }
                    }
                    },
                    { immediate: true }
                );

            }

            watch(
                () => listRoom_id.value,
                async (newVal) => {
                    if (!newVal?.length) return
                    await getAllMessager()
                    await signalR.connectionRoom(newVal)
                },
                { immediate: true }
            )

            async function sendMessage(){
                if (inputMessage.value.trim()) {
                    const message = {
                        message_content: inputMessage.value,
                        user_id: localStorage.getItem('user_id'),
                        message_type: messageType,
                        user_fullName: store.state.user.user_fullName,
                        room_id: objInforChat.room_id.value
                    }
                    if(messageType === 'text'){
                        signalR.sendMessage(message);
                        inputMessage.value = '';
                    }
                    else if(messageType === 'image'){
                        try {
                            const uploadedUrl = await uploadFile(); 
                            const message = {
                                message_content: uploadedUrl,
                                user_id: user_id,
                                message_type: 'image',
                                user_fullName: user.value.user_fullName,
                                room_id: objInforChat.room_id.value
                            };                        
                            signalR.sendMessage(message); 
                            inputMessage.value = '';
                            messageType = oJtype.text
                        } 
                        catch (err) {
                            console.error('Image upload failed', err);
                        }
                    }
                    else if(messageType === 'file'){
                        try {
                            const uploadedUrl = await uploadFile(); 
                            const message = {
                                message_content: uploadedUrl,
                                user_id: user_id,
                                message_type: 'file',
                                user_fullName: user.value.user_fullName,
                                room_id: objInforChat.room_id.value
                            };            

                            signalR.sendMessage(message); 
                            inputMessage.value = '';
                            messageType = oJtype.text
                        } 
                        catch (err) {
                            console.error('Image upload failed', err);
                        }
                    }
                    else{
                        try {
                            const uploadedUrl = await uploadFile(); 
                            const message = {
                                message_content: uploadedUrl,
                                user_id: user_id,
                                message_type: 'video',
                                user_fullName: user.value.user_fullName,
                                room_id: objInforChat.room_id.value
                            };
                            signalR.sendMessage(message); 
                            inputMessage.value = '';
                            messageType = oJtype.text
                        } 
                        catch (err) {
                            console.error('video upload failed', err);
                        }
                    }
                }
            }
            function scrollToBottom() {
                nextTick(() => {
                    bottomMessage.value?.scrollIntoView({ behavior: 'auto' });
                });
            }
            async function getListRoom_id(){
                await store.dispatch('getListRoom_id', user_id)
            }
            async function getAllMessager(){
                await store.dispatch("GetRoomWithUsersByRoom_id", listRoom_id.value)
            }

            async function getMessageUser(id){
                await store.dispatch('getMessageByRoomId', id)
            }


            watch(receiveMessage, async () => {
                await nextTick()
                scrollToBottom()
            })
            watch(
                () => receiveMessage.value.length,
                async (newLen, oldLen) => {
                    if (newLen > oldLen) {
                        await nextTick()
                        scrollToBottom()
                    }
                }
            )


            async function connectReceiver(param){
                objInforChat.user_fullName.value = param.user_fullName
                objInforChat.room_id.value = param.room_id
                
                objInforChat.user_id.value = param.user_id
                objInforChat.user_avatar.value = param.user_avatar
                await getMessageUser(param.room_id)
                if (route.params.id !== param.user_id) {
                    router.push(`/messager/${param.user_id}`)
                }
            }

            return {
                sendMessage, inputMessage, receiveMessage, connectReceiver,
                 user_id, objInforChat, user,formattedListMessager, bottomMessage,
                 uploadToCloud, handleFileChange, getFileName,filteredFormattedListMessager, inputSearchChat
            }
            
        }
    }
</script>

<style scoped>
     .message_content {
        display: flex;
        height: calc(100vh - 66px);
        padding-left:10px ;
        flex: 1;
    }
    .message_content-rom{
        background-color: #f1f3f5;
        flex: 1;
        display: flex;
        flex-direction: column;
        
    }

    .bgrsent{
        background-color: rgba(106, 68, 153, 0.7);
        color: white;
    }
    .bgrrece{
        background-color: white;
    }
    .message_content-rom--conversation{
        flex:1;
        flex-direction: column-reverse;
        overflow-y: scroll;
    }
    .message_content-rom--input {
        position: sticky;
        height: 100px;
        background-color: white;
    }
    .message_content-rom--input input {
        outline: none;
        width: 100%;
        height: 55px;
        padding: 10px 12px;
        font-size: 16px;
        border: none;
    }
    .message_content-list {
        padding-left: 10px;
        width: 320px;
        overflow-y: scroll;

    }
    .conversation_body-message--content span{
        display: block;
        font-size: 12px;
        font-weight: 600;
        opacity: 0.5;
        margin-bottom: 5px;
    }
    .message_content-list:hover::-webkit-scrollbar-thumb{
        background-color: #bdbdbd;
        border-radius: 4px;
    }
    ::-webkit-scrollbar{
        width: 8px;;
    }
    
    .message_content-rom-attached{
        width: 100%;
        height: 40px;
        border: 1px solid #f1f3f5;

        box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
    }
    .message_content-rom-attached i{
        margin: 5px;
        padding: 5px;
        font-size: 20px;
        cursor: pointer;
    }
    .message_content-rom-attached i:hover{
        background-color: #f1f3f5;
    }
    .message_content-account .avatar {
        display: block;
        width: 48px;
        height: 48px;
        border-radius: 50%;
        padding: 6px;
    }
    .message_content-mold i {
       margin: 6px;
    }
    .message_content-mold{
        width: 290px;
        height: 48px;
        margin: 6px 0;
        display: flex;
        align-items: center;
        padding: 8px;
        cursor: pointer;
        border-radius: 8px;
        background-color: white;
        transition: background-color 0.2s ease;
    }
    .message_content-mold:hover{
        background-color: #f1f3f5;
        transition: none;
    } 
    .message_content-describe{
        font-size: 15px;
        font-weight: 600;
        padding: 6px;
    }

    .message_content-header{
        width: 100%;
        height: 68px;
        background-color: white;
        display: flex;
        align-items: center;
        padding: 0 16px;
        border: 1px solid #f1f3f5;
    }

    .message_content-header img {
        width: 48px;
        height: 48px;
        border-radius: 50%;
    }
    .message_content-header-tag{
        padding: 0 10px;
        display: flex;
        flex-direction: column;
    }
    .message_content-header-name{
        font-size: 18px;
        font-weight: 600;
    }
    .message_content-header-status{
        font-size: 10px;
        color: #bdbdbd;
    }
    .conversation_body-incomingMessage--avatar{
        width: 40px;
        height: 40px;
        border-radius: 50%;
    }

    .conversation_body-sentMessage{
        display: flex;
        justify-content: flex-end;
    }

    .conversation_body-sentMessage--avatar{
        width: 40px;
        height: 40px;
        border-radius: 50%;
    }
    .conversation_body-message{
        display: flex;
        align-items: center;
        margin: 12px;
    }
    .conversation_body-message--content{
        padding:10px 12px;
        margin:0 5px;
        border-radius: 16px;
        max-width: 400px;         
        word-wrap: break-word;       
        word-break: break-word;      
        white-space: normal;       
    }

    .message_content-rom--send{
        display: flex;
        border: 1px solid #f1f3f5;
        width: 100%;
        height: 55px;
        font-size: 16px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
        align-items: center;
    }
    .message_content-rom--send i{
        font-size: 20px;
        color: #f06aa7;
        padding: 5px;
        height: 30px;
    }
    .message_content-rom--send i:hover{
        background-color: #bdbdbd;
        cursor: pointer;
    }
</style>

