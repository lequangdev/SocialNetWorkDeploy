import axios from 'axios'

const CLOUD_NAME = 'dvyqx6mfk'
const UPLOAD_PRESET = 'upload-img'

export async function uploadToCloudinary(file, folder_name, type) {
    if (!file) throw new Error('No file provided')
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', UPLOAD_PRESET)
    formData.append("folder", folder_name)

    const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${type}/upload`
    try {
        const response = await axios.post(UPLOAD_URL, formData)
        return response.data.secure_url // hoặc return toàn bộ response.data nếu muốn nhiều info
    } catch (error) {
        console.error('Upload to Cloudinary failed:', error)
        throw error
    }
}