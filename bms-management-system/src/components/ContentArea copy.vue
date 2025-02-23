<template>

  <div class="content">
    <!-- 根据数据类型展示不同内容 -->
    <div v-if="loading" class="loading">加载中...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <pre v-else>{{ data }}</pre>
  </div>


</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import axios from 'axios';

export default defineComponent({
  props: {
    currentView: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const data = ref(null);
    const loading = ref(false);
    const error = ref('');

    const apiMap = {
      'sales-overview': 'boards/show',
      'order-management': 'order/show',
      'customer-management': 'customer/show',
      'employee-management': 'employee/show'
    };

    const fetchData = async () => {
      try {
        loading.value = true;
        error.value = '';
        const response = await axios.get(
          `http://localhost:8086/${apiMap[props.currentView]}`
        );
        data.value = response.data;
      } catch (err) {
        error.value = '数据加载失败，请稍后重试';
        console.error('请求失败:', err);
      } finally {
        loading.value = false;
      }
    };

    // 立即执行一次并在currentView变化时重新获取
    watch(() => props.currentView, fetchData, { immediate: true });

    return {
      data,
      loading,
      error
    };
  }
});
</script>


<style scoped>
.loading {
  color: #666;
  text-align: center;
  padding: 20px;
}

.error {
  color: #ff4444;
  padding: 20px;
}

pre {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  overflow-x: auto;
}
</style>