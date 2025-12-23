<template>
    <div class="container_profile">
        <HeaderLayout></HeaderLayout>
        <div class="container_profile-body">
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

    .container_profile-body{
        margin-top: 66px; 
        display: flex;
    }
</style>