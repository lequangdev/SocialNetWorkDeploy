<template>
    <AuthLayout>
        <div class="login_content">
            <div class="login_content-title">Social network</div>
            <div class="login_content-box">
                <div class="login_content-box--input">
                    <input v-model="payload.user_account" class="account" type="text" placeholder="Nhập tài khoản">
                </div>
                <div class="login_content-box--input">
                    <input v-model="payload.user_password" class="password" type="text" placeholder="Nhập mật khẩu">
                </div>
                <button @click="submit" class="login_content-box--submit">Đăng nhập</button>
                <div class="login_content-box--recover">Quên mật khẩu</div>
                <div class="login_content-box--lines"></div>
                <div @click="turnPage('register')" class="login_content-box--register">Đăng ký</div>
                <div class="login_content-box--link">
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
    import store from '@/store/store';
    import signalR from '@/services/signalRService';
    export default{
        components: {
            AuthLayout
        },
        setup(){
            let router = useRouter();
            function turnPage(param){
                router.push(param)
            }
            let payload = {
                user_account: '',
                user_password: '',
            }
            
            function submit(){
                store.dispatch("loginUser", payload);
            }
            return {
                turnPage, payload, submit,
            }
        }
    }
</script>

<style scoped>
    .login_content{
        height: 100%; 
        display: flex;
        flex-direction: column;
        justify-content: center; 
        align-items: center;     
    }

    .login_content-title{
        font-size: 50px;
        margin-bottom: 20px;
        color: #f06aa7;
    }

    .login_content-box{
        width: 400px;
        height: 350px;
        background-color: white;
        border-radius: 10px;
        box-shadow: 0 0 12px rgba(0, 0, 0, 0.2);
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 10px;
    }

    .login_content-box input{
        width: 365px;
        height: 52px;
        padding: 14px 16px;
        border-radius: 5px;
        border: 1px solid #bdbdbd;
        outline: none;
        font-size: 18px;
        margin: 5px 0;
    }

    .login_content-box--submit{
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

    .login_content-box--register{
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

    .login_content-box--recover{
        color: #0866ff;
        font-size: 14px;
        margin-bottom: 20px;
        cursor: pointer;
    }
    .login_content-box--lines{
        width: 100%;
        border-top: 1px solid #bdbdbd;
    }
    .login_content-box--recover:hover{
        text-decoration: underline;
    }
    .login_content-box--link{
        display: flex;
        align-items: center;
        flex: 1;
    }
    .login_content-box--link i{
        font-size: 20px;
        margin:0 8px;
        padding: 5px;
        cursor: pointer;
    }

    .login_content-box--link i:hover{
        background-color: #bdbdbd;
    }

</style>