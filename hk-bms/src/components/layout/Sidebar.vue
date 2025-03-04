<template>
    <div class="sidebar">
      <el-menu :default-active="activeMenu" @select="handleMenuSelect">
        <el-menu-item index="sales-overview">销售概况</el-menu-item>
        <el-menu-item index="order-management">订单管理</el-menu-item>
        <el-menu-item index="employee-management">员工管理</el-menu-item>
        <el-menu-item index="customer-management">客户管理</el-menu-item>
      </el-menu>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref, onMounted } from 'vue';
  
  export default defineComponent({
    name: 'Sidebar',
    emits: ['select'],
    setup(props, { emit }) {
      const activeMenu = ref(localStorage.getItem('activeMenu') || 'sales-overview');
  
      const handleMenuSelect = (index: string) => {
        activeMenu.value = index; 
         localStorage.setItem('activeMenu', index);
        emit('select', index);
      };
  
      onMounted(() => {
        handleMenuSelect(activeMenu.value);
      });
 
      return {
        activeMenu,
        handleMenuSelect,
      };
    },
  });
  </script>
  
  <style scoped>
  .sidebar {
  width: 200px;
  height: 100%;
  background-color: #304156;
}

/* 菜单整体样式 */
:deep(.el-menu) {
  background-color: transparent;
  border-right: 0;
}

/* 菜单项默认样式 */
:deep(.el-menu-item) {
  color: #c0c4cc !important;
  height: 48px;
  line-height: 48px;
  font-size: 14px;
  transition: all 0.3s;
}

/* 菜单项悬停效果 */
:deep(.el-menu-item:hover) {
  background-color: rgba(0, 0, 0, 0.2) !important;
  color: #fff !important;
}

/* 激活菜单样式 */
:deep(.el-menu-item.is-active) {
  background-color: #263445 !important;
  color: #409eff !important;
  font-weight: 600;
}

/* 菜单项间距调整 */
:deep(.el-menu-item) {
  margin: 4px 8px;
  border-radius: 4px;
}

/* 图标间距调整 */
:deep(.el-menu-item [class^="el-icon"]) {
  margin-right: 12px;
}

/* 分割线颜色 */
:deep(.el-menu-item:not(:last-child)) {
  border-bottom: 1px solid #455672;
}
  </style>

function mounted() {
  throw new Error('Function not implemented.');
}

function mounted() {
  throw new Error('Function not implemented.');
}
  