<template>
    <div class="sidebar">
      <ul>
        <li @click="selectView('sales-overview')">销售概况</li>
        <li @click="selectView('order-management')">订单管理</li>
        <li @click="selectView('customer-management')">客户管理</li>
        <li @click="selectView('employee-management')">用户管理</li>
      </ul>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent } from 'vue';
  
  export default defineComponent({
    emits: ['select'],
    setup(props, { emit }) {
      const selectView = (view: string) => {
        emit('select', view); // 触发父组件的 select 事件
      };
  
      return {
        selectView,
      };
    },
  });
  </script>
  
  <style scoped>
  .sidebar {
    width: 200px;
    background-color: #333;
    color: white;
    padding: 20px;
  }
  
  ul {
    list-style: none;
    padding: 0;
  }
  
  li {
    padding: 10px;
    cursor: pointer;
  }
  
  li:hover {
    background-color: #555;
  }
  </style>