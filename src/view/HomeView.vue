<template>
    <HomeLayout>
        <div class="home_content">
            <div class="post-content">

                <!-- CREATE POST -->
                <div class="create-post">
                    <textarea
                        v-model="newPost.content"
                        placeholder="Bạn đang nghĩ gì?"
                    ></textarea>

                    <!-- PREVIEW MULTI IMAGE / VIDEO -->
                    <div v-if="previews.length" class="preview">
                        <div
                            v-for="(item, index) in previews"
                            :key="index"
                            class="preview-item"
                        >
                            <img
                                v-if="item.type === 'image'"
                                :src="item.url"
                            />
                            <video
                                v-if="item.type === 'video'"
                                :src="item.url"
                                controls
                            ></video>

                            <span
                                class="remove"
                                @click="removePreview(index)"
                            >✖</span>
                        </div>
                    </div>

                    <!-- ACTIONS -->
                    <div class="post-actions">
                        <!-- IMAGE -->
                        <label class="icon-btn">
                            <img
                                height="24"
                                width="24"
                                src="https://static.xx.fbcdn.net/rsrc.php/v4/y7/r/Ivw7nhRtXyo.png"
                            />
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                hidden
                                @change="onFileChange"
                            />
                        </label>

                        <!-- VIDEO -->
                        <label class="icon-btn">
                            <img
                                height="24"
                                width="24"
                                src="https://static.xx.fbcdn.net/rsrc.php/v4/yr/r/c0dWho49-X3.png"
                            />
                            <input
                                type="file"
                                accept="video/*"
                                multiple
                                hidden
                                @change="onFileChange"
                            />
                        </label>

                        <select v-model="newPost.privacy" class="cursor-pointer">
                            <option value="public">🌍 Công khai</option>
                            <option value="friends">👥 Bạn bè</option>
                            <option value="private">🔒 Riêng tư</option>
                        </select>

                        <button class="post-btn" @click="createPost">
                            Đăng
                        </button>
                    </div>
                </div>

                <!-- POST LIST -->
                <div class="post-list">
                    <div
                        class="post-item"
                        v-for="post in posts"
                        :key="post.id"
                    >
                        <div class="post-header">
                            <strong>{{ post.author }}</strong>
                            <span class="privacy">
                                {{ mapPrivacy(post.privacy) }}
                            </span>
                        </div>

                        <div class="post-body">
                            <p>{{ post.content }}</p>
                        </div>

                        <div class="post-footer">
                            <small>{{ post.createdAt }}</small>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </HomeLayout>
</template>

<script>
import HomeLayout from '@/layouts/HomeLayout.vue'
import { ref } from 'vue'

export default {
    components: { HomeLayout },

    setup() {
        const posts = ref([
            {
                id: 1,
                author: 'Quang',
                content: 'Bài viết đầu tiên 🎉',
                privacy: 'public',
                createdAt: '2026-01-12 18:00'
            }
        ])

        const newPost = ref({
            content: '',
            privacy: 'public'
        })

        const previews = ref([])
        const filesUpload = ref([])

        const onFileChange = (e) => {
            const files = Array.from(e.target.files)
            if (!files.length) return

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

        const createPost = () => {
            if (!newPost.value.content.trim()) return

            posts.value.unshift({
                author: 'Quang',
                content: newPost.value.content,
                privacy: newPost.value.privacy,
                createdAt: new Date().toLocaleString()
            })

            newPost.value.content = ''
            newPost.value.privacy = 'public'
            previews.value = []
            filesUpload.value = []
        }

        const mapPrivacy = (privacy) => {
            if (privacy === 'public') return '🌍 Công khai'
            if (privacy === 'friends') return '👥 Bạn bè'
            if (privacy === 'private') return '🔒 Riêng tư'
            return ''
        }

        return {
            posts,
            newPost,
            previews,
            onFileChange,
            removePreview,
            createPost,
            mapPrivacy
        }
    }
}
</script>

<style scoped>
.home_content {
    width: 100%;
}

.post-content {
    width: 100%;
    padding: 12px;
}

.create-post {
    background: #fff;
    padding: 12px;
    border-radius: 8px;
    margin-bottom: 16px;
    box-shadow: 0 1px 4px rgba(0,0,0,.1);
}

.create-post textarea {
    width: 100%;
    min-height: 80px;
    resize: none;
    padding: 8px;
    border-radius: 6px;
    border: 1px solid #ddd;
    outline: none;
}

.preview {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 10px;
}

.preview-item {
    width: 120px;
    height: 120px;
    position: relative;
    border-radius: 6px;
    overflow: hidden;
    background: #f0f2f5;
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
    width: 20px;
    height: 20px;
    background: rgba(0,0,0,.6);
    color: white;
    border-radius: 50%;
    font-size: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
}

.post-actions {
    display: flex;
    align-items: center;
    margin-top: 10px;
}

.icon-btn {
    margin-right: 10px;
    cursor: pointer;
}

.cursor-pointer {
    cursor: pointer;
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

.post-item {
    background: #fff;
    padding: 12px;
    border-radius: 8px;
    margin-bottom: 12px;
    box-shadow: 0 1px 4px rgba(0,0,0,.08);
}
</style>
