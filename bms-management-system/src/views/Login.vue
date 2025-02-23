<template>
    <div class="login-container">
      <h2>登录</h2>
      <form @submit.prevent="handleLogin">
        <div>
          <label for="employeeId">员工工号:</label>
          <input type="text" id="employeeId" v-model="employeeId" required />
        </div>
        <div>
          <label for="password">密码:</label>
          <input type="password" id="password" v-model="password" required />
        </div>
        <button type="submit">登录</button>
      </form>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { useRouter } from 'vue-router';
  import axios from 'axios';
  
  export default defineComponent({
    setup() {
      const employeeId = ref('');
      const password = ref('');
      const router = useRouter();
  
      const handleLogin = async () => {
        try {
          const response = await axios.post('http://localhost:8086/login/common', {
            employeeId: employeeId.value,
            password: password.value,
          });
  
          if (response.data.code === 'SUCCESS') {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('userType', response.data.userType);
            router.push('/boards');
          } else {
            alert(response.data.message);
          }
        } catch (error) {
          console.error('登录失败:', error);
        }
      };
  
      return {
        employeeId,
        password,
        handleLogin,
      };
    },
  });
  </script>
  
  <style scoped>
  .login-container {
    max-width: 300px;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
  </style>