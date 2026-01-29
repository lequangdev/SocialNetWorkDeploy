<template>
    <HomeLayout>
        <div class="home_content">
            <div class="post-content">

                <!-- CREATE POST -->
                <div class="create-post">
                    <textarea v-model="newPost.content" placeholder="Bạn đang nghĩ gì?"></textarea>

                    <!-- PREVIEW MEDIA -->
                    <div v-if="previews.length" class="preview">
                        <div v-for="(item, index) in previews" :key="index" class="preview-item">
                            <img v-if="item.type === 'image'" :src="item.url" />
                            <video v-else :src="item.url" controls></video>

                            <span class="remove" @click="removePreview(index)">✖</span>
                        </div>
                    </div>

                    <!-- ACTIONS -->
                    <div class="post-actions">
                        <label class="icon-btn">
                            <img height="24" width="24"
                                src="https://static.xx.fbcdn.net/rsrc.php/v4/y7/r/Ivw7nhRtXyo.png" />
                            <input type="file" accept="image/*" multiple hidden @change="onFileChange" />
                        </label>

                        <label class="icon-btn">
                            <img height="24" width="24"
                                src="https://static.xx.fbcdn.net/rsrc.php/v4/yr/r/c0dWho49-X3.png" />
                            <input type="file" accept="video/*" multiple hidden @change="onFileChange" />
                        </label>

                        <select class="optionPrivacy" v-model="newPost.privacy">
                            <option :value="2">🌍 Công khai</option>
                            <option :value="1">👥 Bạn bè</option>
                            <option :value="0">🔒 Riêng tư</option>
                        </select>

                        <button class="post-btn" @click="createPost">
                            Đăng
                        </button>
                    </div>
                </div>

                <!-- POST LIST -->
                <div class="post-list">
                    <div class="post-item" v-for="post in posts" :key="post.posts_id">
                        <!-- HEADER -->
                        <div class="post-header">
                            <img class="avatar" :src="post.user.user_avatar" />
                            <div>
                                <strong>{{ post.user.user_fullName }}</strong>
                                <div class="datePosted">
                                    <small>{{ formatDate(post.created_date) }}</small>
                                </div>
                            </div>
                        </div>

                        <!-- BODY -->
                        <div class="post-body">
                            <p>{{ post.content }}</p>

                            <div v-if="post.mediaDTOs?.length" class="post-media"
                                :class="mediaLayoutClass(post.mediaDTOs.length)">
                                <div v-for="(media, index) in post.mediaDTOs.slice(0, 5)" :key="media.post_media_id"
                                    class="media-item">
                                    <img v-if="media.media_type === 'image'" :src="media.media_url" />
                                    <video v-else :src="media.media_url" controls />

                                    <!-- Overlay +N -->
                                    <div v-if="index === 4 && post.mediaDTOs.length > 5" class="media-more">
                                        +{{ post.mediaDTOs.length - 5 }}
                                    </div>
                                </div>
                            </div>

                        </div>

                        <!-- FOOTER -->
                        <div class="post-footer">
                            <div class="post-footer-text">
                                <span><img class="x16dsc37" height="18" role="presentation" width="18"
                                        src="data:image/svg+xml,%3Csvg fill='none' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath d='M16.0001 7.9996c0 4.418-3.5815 7.9996-7.9995 7.9996S.001 12.4176.001 7.9996 3.5825 0 8.0006 0C12.4186 0 16 3.5815 16 7.9996Z' fill='url(%23paint0_linear_15251_63610)'/%3E%3Cpath d='M16.0001 7.9996c0 4.418-3.5815 7.9996-7.9995 7.9996S.001 12.4176.001 7.9996 3.5825 0 8.0006 0C12.4186 0 16 3.5815 16 7.9996Z' fill='url(%23paint1_radial_15251_63610)'/%3E%3Cpath d='M16.0001 7.9996c0 4.418-3.5815 7.9996-7.9995 7.9996S.001 12.4176.001 7.9996 3.5825 0 8.0006 0C12.4186 0 16 3.5815 16 7.9996Z' fill='url(%23paint2_radial_15251_63610)' fill-opacity='.5'/%3E%3Cpath d='M7.3014 3.8662a.6974.6974 0 0 1 .6974-.6977c.6742 0 1.2207.5465 1.2207 1.2206v1.7464a.101.101 0 0 0 .101.101h1.7953c.992 0 1.7232.9273 1.4917 1.892l-.4572 1.9047a2.301 2.301 0 0 1-2.2374 1.764H6.9185a.5752.5752 0 0 1-.5752-.5752V7.7384c0-.4168.097-.8278.2834-1.2005l.2856-.5712a3.6878 3.6878 0 0 0 .3893-1.6509l-.0002-.4496ZM4.367 7a.767.767 0 0 0-.7669.767v3.2598a.767.767 0 0 0 .767.767h.767a.3835.3835 0 0 0 .3835-.3835V7.3835A.3835.3835 0 0 0 5.134 7h-.767Z' fill='%23fff'/%3E%3Cdefs%3E%3CradialGradient id='paint1_radial_15251_63610' cx='0' cy='0' r='1' gradientUnits='userSpaceOnUse' gradientTransform='rotate(90 .0005 8) scale(7.99958)'%3E%3Cstop offset='.5618' stop-color='%230866FF' stop-opacity='0'/%3E%3Cstop offset='1' stop-color='%230866FF' stop-opacity='.1'/%3E%3C/radialGradient%3E%3CradialGradient id='paint2_radial_15251_63610' cx='0' cy='0' r='1' gradientUnits='userSpaceOnUse' gradientTransform='rotate(45 -4.5257 10.9237) scale(10.1818)'%3E%3Cstop offset='.3143' stop-color='%2302ADFC'/%3E%3Cstop offset='1' stop-color='%2302ADFC' stop-opacity='0'/%3E%3C/radialGradient%3E%3ClinearGradient id='paint0_linear_15251_63610' x1='2.3989' y1='2.3999' x2='13.5983' y2='13.5993' gradientUnits='userSpaceOnUse'%3E%3Cstop stop-color='%2302ADFC'/%3E%3Cstop offset='.5' stop-color='%230866FF'/%3E%3Cstop offset='1' stop-color='%232B7EFF'/%3E%3C/linearGradient%3E%3C/defs%3E%3C/svg%3E">
                                    {{ post.like_count }}</span>
                                <span>{{ post.comment_count }} Bình luận</span>
                            </div>
                            <div class="post-footer-btn">
                                <span><i data-visualcompletion="css-img" class="x1b0d499 x1d69dk1"
                                        style="background-image: url(&quot;https://static.xx.fbcdn.net/rsrc.php/v4/yZ/r/6IA92nEe6LR.png?_nc_eui2=AeEhwkKzznZba0HmLFBFTUdrxHbXP_lsqWHEdtc_-WypYXMnWOD51I7roPWI1fnzAtbLPEYLVrZ0ovOuQSPNXoXF&quot;); background-position: 0px -783px; background-size: auto; width: 20px; height: 20px; background-repeat: no-repeat; display: inline-block;"></i>Like</span>
                                <span><i data-visualcompletion="css-img" class="x1b0d499 x1d69dk1"
                                        style="background-image: url(&quot;https://static.xx.fbcdn.net/rsrc.php/v4/yZ/r/6IA92nEe6LR.png?_nc_eui2=AeEhwkKzznZba0HmLFBFTUdrxHbXP_lsqWHEdtc_-WypYXMnWOD51I7roPWI1fnzAtbLPEYLVrZ0ovOuQSPNXoXF&quot;); background-position: 0px -741px; background-size: auto; width: 20px; height: 20px; background-repeat: no-repeat; display: inline-block;"></i>Bình
                                    luận </span>
                                <span><i data-visualcompletion="css-img" class="x1b0d499 x1d69dk1"
                                        style="background-image: url(&quot;https://static.xx.fbcdn.net/rsrc.php/v4/yZ/r/6IA92nEe6LR.png?_nc_eui2=AeEhwkKzznZba0HmLFBFTUdrxHbXP_lsqWHEdtc_-WypYXMnWOD51I7roPWI1fnzAtbLPEYLVrZ0ovOuQSPNXoXF&quot;); background-position: 0px -804px; background-size: auto; width: 20px; height: 20px; background-repeat: no-repeat; display: inline-block;"></i>Chia
                                    sẻ</span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </HomeLayout>
</template>

<script>
import { computed, ref, onMounted } from 'vue'
import HomeLayout from '@/layouts/HomeLayout.vue'
import { useStore } from 'vuex';
import { uploadToCloudinary } from '@/cloudinary/cloudinaryService';

export default {
    components: { HomeLayout },

    setup() {
        onMounted(() => {
            store.dispatch("getPostList")
        })
        var store = useStore()
        const posts = computed(() => store.state.postList)
        const newPost = ref({
            content: '',
            privacy: 2
        })

        const previews = ref([])
        const filesUpload = ref([])
        const mediaLayoutClass = (count) => {
            if (count === 1) return 'layout-1'
            if (count === 2) return 'layout-2'
            if (count === 3) return 'layout-3'
            if (count === 4) return 'layout-4'
            return 'layout-5'
        }


        const onFileChange = (e) => {
            const files = Array.from(e.target.files)
            files.forEach(file => {
                const type = file.type.startsWith('image')
                    ? 'image'
                    : file.type.startsWith('video')
                        ? 'video'
                        : null
                if (!type) return

                previews.value.push({
                    url: URL.createObjectURL(file),
                    type
                })
                filesUpload.value.push(file)
            })
            e.target.value = ''
        }

        const removePreview = (index) => {
            URL.revokeObjectURL(previews.value[index].url)
            previews.value.splice(index, 1)
            filesUpload.value.splice(index, 1)
        }

        async function createPost() {
            var medias = []
            for (let i = 0; i < filesUpload.value.length; i++) {
                const file = filesUpload.value[i]
                const type = file.type.startsWith('image') ? 'image' : 'video'
                const resourceType = type === 'image' ? 'img_social' : 'video_social'
                const result_url = await uploadToCloudinary(
                    file,
                    resourceType,
                    type
                )
                medias.push({
                    media_url: result_url,
                    media_type: type
                })
            }
            var post = {
                user_id: localStorage.getItem("user_id"),
                content: newPost.value.content,
                privacy: newPost.value.privacy,
                mediaDTOs: medias,
            }
            store.dispatch("insertPost", post)
        }

        const mapPrivacy = (privacy) => {
            switch (privacy) {
                case 0: return '🌍 Công khai'
                case 1: return '👥 Bạn bè'
                case 2: return '🔒 Riêng tư'
                default: return ''
            }
        }

        const formatDate = (date) => {
            return new Date(date).toLocaleString('vi-VN')
        }

        return {
            posts,
            newPost,
            previews,
            onFileChange,
            removePreview,
            createPost,
            mapPrivacy,
            formatDate,
            mediaLayoutClass
        }
    }
}
</script>

<style scoped>
html, body {
    height: 100%;
    overflow: hidden;
}

.home_content {
    height: calc(100vh - 66px); /* trừ header */
    width: 100%;
    flex: 1;
    padding: 0 10px;
    background-color: #f1f3f5;

    overflow-y: auto;   /* ✅ CHỈ SCROLL Ở ĐÂY */
}

.post-list {
    width: 680px;
}

.post-content {
    padding: 12px;
    display: flex;
    flex-direction: column;
    align-items: center;

    min-height: 100%; /* quan trọng */
}

.create-post {
    width: 100%;
}

.create-post,
.post-item {
    background: #fff;
    padding: 8px 8px 5px 8px;
    border-radius: 8px;
    margin-bottom: 16px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, .1);
}

.datePosted {
    font-size: 14px;
    font-weight: bold;
    color: #65686C;
}

textarea {
    width: 100%;
    min-height: 80px;
    resize: none;
    padding: 8px;
    border-radius: 6px;
    border: 1px solid #ddd;
}

.preview {
    display: flex;
    gap: 8px;
    margin-top: 10px;
}

.preview-item {
    width: 120px;
    height: 120px;
    position: relative;
}

.preview-item img,
.preview-item video {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.remove {
    position: absolute;
    top: 4px;
    right: 4px;
    background: rgba(0, 0, 0, .6);
    color: white;
    border-radius: 50%;
    padding: 2px 6px;
    cursor: pointer;
}

.post-actions {
    display: flex;
    align-items: center;
    margin-top: 10px;
}

.post-btn {
    margin-left: auto;
    background: #1877f2;
    color: white;
    border: none;
    border-radius: 6px;
    padding: 6px 14px;
    cursor: pointer;
}

.post-header {
    display: flex;
    gap: 10px;
}

.avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
}

.post-media {
    width: 100%;
    max-height: 700px;
    display: grid;
    gap: 4px;
    overflow: hidden;
}
.media-item {
    position: relative;
    background-color: #555;
}
.media-item img{
    width: 100%;
    height: 100%;
    object-fit: cover;
}
.media-item video {
    max-height: 700px;
    width: auto;
    max-width: 100%;
    object-fit: contain;
    display: block;
    margin: 0 auto;
}

.layout-1 {
    grid-template-columns: 1fr;
}
.layout-2 {
    grid-template-columns: repeat(2, 1fr);
    height: 350px;
}
.layout-3 {
    grid-template-columns: 2fr 1fr;
    grid-template-rows: repeat(2, 1fr);
    height: 700px;
}

.layout-3 .media-item:first-child {
    grid-row: span 2;
}
.layout-4 {
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(2, 1fr);
    height: 700px;
}
.layout-5 {
    grid-template-columns: 2fr 1fr;
    grid-template-rows: repeat(2, 1fr);
    height: 700px;
}

.layout-5 .media-item:first-child {
    grid-row: span 2;
}
.optionPrivacy{
    margin: 0 4px;
    padding: 5px;
    cursor: pointer;
}
.media-more {
    position: absolute;
    inset: 0;
    background: rgba(0,0,0,.6);
    color: white;
    font-size: 32px;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
}


.post-footer-btn span {
    display: flex;
    cursor: pointer;
    height: 32px;
    justify-content: center;
    align-items: center;
    border-radius: 5px;
    margin: 0 5px;
    flex: 1;
}

.post-footer-btn i {
    margin: 0 5px;
}

.post-footer-btn {
    display: flex;
    justify-content: space-between;
    margin-top: 8px;
    font-size: 13px;
    color: #65686C;
    font-size: 15px;
    font-weight: bold;
}

.post-footer-text {
    display: flex;
    justify-content: space-between;
    margin-top: 8px;
    font-size: 13px;
    color: #555;

}

.post-footer span:hover {
    background-color: #f1f3f5;
}
.icon-btn{
    margin: 0 4px;
    padding: 5px;
    border-radius: 4PX;
}
.icon-btn:hover{
    background-color: #E2E5E9;
    cursor: pointer;
}
</style>
