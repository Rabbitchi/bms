<template>
  <footer class="footer">
    <p>&copy; 2023 BMS 管理系统. 版权所有.</p>
  </footer>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
name: 'Footer',
});
</script>

<style scoped>
.footer {
  background-color: #304156; /* 与侧边栏一致的颜色 */
  color: white;
  padding: 10px;
  text-align: center;
  bottom: 0;
  width: 100%;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
}

p {
  margin: 0;
  font-size: 14px;
}
</style>
