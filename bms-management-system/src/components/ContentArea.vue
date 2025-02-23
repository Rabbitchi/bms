<template>
  <div class="content-area">
    <component :is="currentViewComponent" />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import SalesOverview from '@/components/content/SalesOverview.vue';
import OrderManagement from '@/components/content/OrderManagement.vue';
import CustomerManagement from '@/components/content/CustomerManagement.vue';
import EmployeeManagement from '@/components/content/EmployeeManagement.vue';

export default defineComponent({
  name: 'ContentArea', // 添加组件名称
  props: {
    currentView: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    // 确保所有组件已正确导入
    const componentsMap = {
      'sales-overview': SalesOverview,
      'order-management': OrderManagement,
      'customer-management': CustomerManagement,
      'employee-management': EmployeeManagement,
    };

    const currentViewComponent = computed(() => {
      return componentsMap[props.currentView as keyof typeof componentsMap];
    });

    return {
      currentViewComponent,
    };
  },
});
</script>

<style scoped>
.content-area {
  padding: 20px;
}
</style>