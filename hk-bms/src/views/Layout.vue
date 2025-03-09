<template>
    <div class="layout-container">
        <Header />
        <div class="main-content">
            <Sidebar />
            <div class="content-area">
                <router-view></router-view>
            </div>
        </div>
        <Footer />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Header from '@/components/layout/Header.vue';
import Sidebar from '@/components/layout/Sidebar.vue';
import Footer from '@/components/layout/Footer.vue';


export default defineComponent({
    name: 'Layout',
    components: {
        Header,
        Sidebar,
        Footer,
    }
});
</script>

<style scoped>
.layout-container {
    display: flex;
    flex-direction: column;
    height: 100vh;
}

.main-content {
    display: flex;
    flex: 1;
    overflow: auto;
}

.content-area {
    flex: 1;
    padding: 8px;
    background-color: #f5f5f5;
}
</style>