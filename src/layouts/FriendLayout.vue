<template>
    <div class="container_friend">
        <HeaderLayout></HeaderLayout>
        <div class="container_friend-body">
            <CategoryLayout></CategoryLayout>
            <slot></slot>
        </div>
    </div>
</template>

<script>
    import HeaderLayout from './HeaderLayout.vue';
    import CategoryLayout from './CategoryLayout.vue';
    export default{
        components: {
            HeaderLayout,CategoryLayout
        },
        setup(){
            
        }
    }
</script>

<style scoped>
    .container_friend-body{
        margin-top: 66px; 
        display: flex;
    }
</style>
