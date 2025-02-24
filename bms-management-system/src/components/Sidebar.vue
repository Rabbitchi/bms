<template>
  <div class="sidebar">
    <ul>
      <li 
        v-for="item in menuItems" 
        :key="item.key"
        :class="{ active: activeView === item.key }"
        @click="selectView(item.key)"
      >
        {{ item.label }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  emits: ['select'],
  setup(props, { emit }) {
    const activeView = ref('sales-overview');
    const menuItems = [
      { key: 'sales-overview', label: '销售概况' },
      { key: 'order-management', label: '订单管理' },
      { key: 'customer-management', label: '客户管理' },
      { key: 'employee-management', label: '用户管理' }
    ];

    const selectView = (view: string) => {
      activeView.value = view;
      emit('select', view);
    };

    return {
      selectView,
      menuItems,
      activeView
    };
  }
});
</script>

<style scoped>
.sidebar {
  width: 120px;
  background-color: #f8f9fa;
  padding: 20px;
  border-right: 1px solid #dee2e6;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

li {
  padding: 12px 16px;
  margin: 8px 0;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s;
  color: #495057;
}

li:hover {
  background-color: #e9ecef;
}

li.active {
  background-color: #e3f2fd;
  color: #1976d2;
  font-weight: 500;
}
</style>