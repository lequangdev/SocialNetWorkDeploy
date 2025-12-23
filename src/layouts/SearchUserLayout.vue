<template>
    <div class="container_SearchUser">
        <HeaderLayout></HeaderLayout>
        <div class="container_SearchUser-body">
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

    .container_SearchUser-body{
        margin-top: 66px; 
        display: flex;
    }
</style>