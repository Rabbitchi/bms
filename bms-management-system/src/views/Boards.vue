<template>
    <div class="boards-container">
        <Header/>
        <div class="main-content">
            <!-- 左侧侧边栏 -->
            <Sidebar @select="handleSidebarSelect" />
            <!-- 右侧内容区域 -->
            <div class="content-area">
                <ContentArea :currentView="currentView" />
            </div>
        </div>
        <Footer/>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import Header from '@/components/Header.vue';
import Sidebar from '@/components/Sidebar.vue';
import ContentArea from '@/components/ContentArea.vue';
import Footer from '@/components/Footer.vue';

export default defineComponent({
    components: {
        Header,
        Sidebar,
        ContentArea,
        Footer,
    },
    setup() {
        const currentView = ref('sales-overview'); // 默认展示销售概况

        const handleSidebarSelect = (view: string) => {
            currentView.value = view; // 更新当前视图
        };

        return {
            currentView,
            handleSidebarSelect,
        };
    },
});
</script>

<style scoped>
.boards-container {
    display: flex;
    flex-direction: column;
    height: 100vh;
}

.main-content {
    display: flex;
    flex: 1;
}

.content-area {
    flex: 1;
    padding: 20px;
    background-color: #f5f5f5;
}
</style>