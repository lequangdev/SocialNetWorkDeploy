<template>
    <AuthLayout>
        <div class="register_content">
            <div class="register_content-title">Social network</div>
            <div class="register_content-box" >
                <div class="register_content-box--input">
                    <input v-model="payload.user_fullname" class="full_name" type="text" placeholder="Họ và tên">
                </div>
                <div class="register_content-box--input">
                    <input v-model="payload.user_account" class="account" type="text" placeholder="Nhập tài khoản">
                </div>
                <div class="register_content-box--input">
                    <input v-model="payload.user_password" class="password" type="text" placeholder="Nhập mật khẩu">
                </div>
                <div class="register_content-box--input">
                    <input v-model="confirmPass" class="confirmPass" type="text" placeholder="Nhập lại mật khẩu">
                </div>
                <div class="register_content-box--input">
                    <input v-model="payload.phone_number" class="phone_number" type="text" placeholder="(84+) Số điện thoại">
                </div>
                <span 
                    v-if="notification.message"
                    :class="['register_content-box--notification', notification.type]"
                >
                    {{ notification.message }}
                </span>
                <button @click="submit" class="register_content-box--submit">Đăng ký</button>
                <div class="register_content-box--recover">Quên mật khẩu</div>
                <div class="register_content-box--lines"></div>
                <div @click="turnPage('login')" class="register_content-box--login">Đăng nhập</div>
                <div class="register_content-box--link">
                    <i class="fa-brands fa-google" title="google" ></i>
                    <i class="fa-brands fa-instagram" title="instagram"></i>
                    <i class="fa-brands fa-youtube" title="youtube"></i>
                    <i class="fa-brands fa-tiktok" title="tiktok"></i>
                    <i class="fa-brands fa-twitter" title="twitter"></i>
                </div>
            </div>
        </div>
    </AuthLayout>
</template>

<script>
    import { useRouter } from 'vue-router';
    import AuthLayout from '@/layouts/AuthLayout.vue';
    import { ref, computed } from 'vue';
    import { useStore } from 'vuex';
    export default{
        components: {
            AuthLayout
        },
        setup(){
            const store = useStore();
            let notification = computed(() => store.getters.notification || { message: '', type: '' });
            let router = useRouter();
            let confirmPass = ref('');
            function turnPage(param){
                router.push(param)
            }
            let payload = {
                user_fullname: '',
                user_account: '',
                user_password: '',
                phone_number: '',
                user_avatar: 'https://tte.edu.vn/public/upload/2025/01/avatar-de-thuong41.webp'
            }
            
            function submit(){
                if(payload.phone_number !== "" && payload.user_account !== "" && payload.user_fullname !== "" && payload.user_password !== ""){
                    if(payload.user_password == confirmPass.value){
                        store.dispatch("registerUser", payload);
                    }else{
                        store.commit("setNotification",{
                            message:'Mật khẩu nhập lại không khớp',
                            type:'error'
                        })
                    }
                }
                else{
                    store.commit("setNotification",{
                        message:'Vui lòng điền đầy đủ thông tin',
                        type:'error'
                    })
                }
            }


            return {
                turnPage, payload, submit,confirmPass,notification
            }
        }
    }
</script>

<style scoped>
    .register_content-box--notification{
        font-size: 14px;               
        display: block;
    }
    .register_content-box--notification.error{
        color: #dc3545;
    }
    .register_content-box--notification.success{
        color: #28a745;
    }
    .register_content{
        height: 100%; 
        display: flex;
        flex-direction: column;
        justify-content: center; 
        align-items: center;     
    }

    .register_content-title{
        font-size: 50px;
        margin-bottom: 20px;
        color: #f06aa7;
    }

    .register_content-box{
        width: 400px;
        height: 580px;
        background-color: white;
        border-radius: 10px;
        box-shadow: 0 0 12px rgba(0, 0, 0, 0.2);
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 10px;
    }

    .register_content-box input{
        width: 365px;
        height: 52px;
        padding: 14px 16px;
        border-radius: 5px;
        border: 1px solid #bdbdbd;
        outline: none;
        font-size: 18px;
        margin: 5px 0;
    }

    .register_content-box--submit{
        margin: 10px;
        line-height: 48px;
        text-align: center;
        width: 365px;
        height: 48px;
        background-color: #f06aa7;
        border-radius: 10px;
        font-size: 20px;
        color: white;
        cursor: pointer;
        border: none;
    }

    .register_content-box--login{
        width: 180px;
        background-color: #0866ff;
        height: 48px;
        line-height: 48px;
        text-align: center;
        border-radius: 10px;
        font-size: 20px;
        color: white;
        cursor: pointer;
        margin: 15px 0;
    }

    .register_content-box--recover{
        color: #0866ff;
        font-size: 14px;
        margin-bottom: 20px;
        cursor: pointer;
    }
    .register_content-box--lines{
        width: 100%;
        border-top: 1px solid #bdbdbd;
    }
    .register_content-box--recover:hover{
        text-decoration: underline;
    }
    .register_content-box--link{
        display: flex;
        align-items: center;
        flex: 1;
    }
    .register_content-box--link i{
        font-size: 20px;
        margin:0 8px;
        padding: 5px;
        cursor: pointer;
    }

    .register_content-box--link i:hover{
        background-color: #bdbdbd;
    }

</style>