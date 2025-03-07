<template>
  <div class="login-wrapper">
    <div class="system-title">华科检测管理系统</div>
    <div class="login-container">
      <div class="header">
        <h1>欢迎回来</h1>
        <p>请输入您的凭证以继续</p>
      </div>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="employeeId">员工工号</label>
          <input type="text" id="employeeId" v-model="employeeId" placeholder="请输入您的工号" required />
        </div>
        <div class="form-group">
          <label for="password">密码</label>
          <input type="password" id="password" v-model="password" placeholder="请输入您的密码" required />
        </div>
        <button type="submit" class="login-btn">登 录</button>
      </form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { getLogin } from "@/api/login"

const employeeId = ref('');
const password = ref('');
const router = useRouter();

const handleLogin = async () => {
  try {
    console.log('employeeId:', employeeId.value);

    const response = await getLogin(
      employeeId.value,
      password.value,
    );

    if (response.data.code === 'SUCCESS') {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userType', response.data.userType);
      localStorage.setItem('username', response.data.username)
      router.push('/layout/sales-overview');
    } else {
      alert(response.data.message);
    }
  } catch (error) {
    console.error('登录失败:', error);
  }
};


</script>


<style scoped>
.login-wrapper {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  position: relative;
  overflow: hidden;
}

.system-title {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 2rem;
  color: rgba(0, 0, 0, 0.15);
  font-weight: bold;
  letter-spacing: 4px;
  user-select: none;
  white-space: nowrap;
}

.login-container {
  background: white;
  padding: 40px 50px;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  width: 400px;
  transform: translateY(-10%);
}

.header {
  text-align: center;
  margin-bottom: 40px;
}

.header h1 {
  color: #2c3e50;
  font-size: 28px;
  margin-bottom: 8px;
}

.header p {
  color: #7f8c8d;
  font-size: 14px;
}

.form-group {
  margin-bottom: 24px;
}

label {
  display: block;
  margin-bottom: 8px;
  color: #34495e;
  font-size: 14px;
  font-weight: 500;
}

input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e0e4e7;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s ease;
}

input:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
}

.login-btn {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #3498db, #2980b9);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 16px;
}

.login-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 5px 15px rgba(52, 152, 219, 0.3);
}

.login-btn:active {
  transform: translateY(0);
}
</style>