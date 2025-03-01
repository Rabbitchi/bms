<template>
  <header class="header">
    <h1 class="header-title">BMS 管理系统</h1>
    <div class="header-right">
      <div class="user-info">
        <span class="welcome-text">你好，{{ username }}</span>
        <el-tooltip content="退出登录" placement="bottom">
          <el-icon class="logout-icon" @click="handleLogout">
            <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
              <path fill="currentColor" d="M768 106V184c97 0 186 40 252 104 64 64 104 154 104 252h84c0-139-57-266-149-358-90-90-217-147-355-147zm-604 0h532v82H164c-90 0-164 74-164 164v440c0 90 74 164 164 164h532v84H164C74 894 0 820 0 730V290C0 200 74 126 164 126zm384 438L428 542l113-114-62-62-114 114-114-114-62 62 114 114-114 114 62 62 114-114 114 114 62-62-113-114z"/>
            </svg>
          </el-icon>
        </el-tooltip>
      </div>
    </div>
  </header>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage, ElIcon, ElTooltip } from 'element-plus';

export default defineComponent({
  name: 'Header',
  components: {
    ElIcon,
    ElTooltip
  },
  setup() {
    const username = ref('');
    const router = useRouter();

    onMounted(() => {
      username.value = localStorage.getItem('username') || '管理员';
    });

    const handleLogout = () => {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      ElMessage.success('退出登录成功');
      router.push('/login');
    };

    return {
      username,
      handleLogout,
    };
  },
});
</script>

<style scoped>
.header {
  background-color: #304156;
  color: white;
  padding: 0 20px;
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.header-title {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.header-right {
  margin-left: auto;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.welcome-text {
  font-size: 14px;
  color: #d1d1d1;
}

.logout-icon {
  cursor: pointer;
  color: #d1d1d1;
  font-size: 18px;
  transition: color 0.3s ease;
  padding: 6px;
  border-radius: 4px;
}

.logout-icon:hover {
  color: #fff;
  background-color: rgba(255, 255, 255, 0.1);
}

.logout-icon svg {
  display: block;
  width: 1em;
  height: 1em;
}
</style>