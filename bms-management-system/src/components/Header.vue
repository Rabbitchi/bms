<template>
    <header class="header">
      <h1>BMS 管理系统</h1>
    </header>
  </template>
  
  <script lang="ts">
  import { defineComponent } from 'vue';
  
  export default defineComponent({
    name: 'Header',
  });
  </script>
  
  <style scoped>
  .header {
    background-color: #42b983;
    color: white;
    padding: 20px;
    text-align: center;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }
  
  h1 {
    margin: 0;
    font-size: 24px;
  }
  </style>