<template>
    <div class="customer-management">
      <el-card class="table-card">
        <el-table :data="data" border stripe style="width: 100%" v-loading="loading">
          <template v-for="(value, key) in tableHeaders" :key="key">
            <el-table-column :prop="key" :label="value" sortable min-width="60" />
          </template>
        </el-table>
      </el-card>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, onMounted, ref } from 'vue';
  import { getCustomerList } from '@/api/customer';
  
  export default defineComponent({
    name: 'CustomerManagement',
    setup() {
      const data = ref<any[]>([]);
      const loading = ref(false);
  
      const tableHeaders = {
        id: 'ID',
        name: '客户名称',
        remark: '备注',
      };
  
      const fetchData = async () => {
        try {
          loading.value = true;
          const response = await getCustomerList();
          data.value = response.data;
        } catch (error) {
          console.error('请求失败:', error);
        } finally {
          loading.value = false;
        }
      };
  
      onMounted(() => {
        fetchData();
      });
  
      return {
        data,
        loading,
        tableHeaders,
      };
    },
  });
  </script>
  

  <style scoped>
  /* 用户类型选择器样式 */
  .el-select {
    width: 100%;
  }
  /* 新增年份选择器样式 */
  .year-selector {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 20px;
  }
  
  /* 工具条样式 */
  .toolbar {
    margin-bottom: 15px;
    display: flex;
    align-items: center;
  }
  
  .button-group {
    display: flex;
    align-items: center;
  }
  
  /* 搜索条件行样式 */
  .filter-row {
    margin: 15px 0;
    display: flex;
    justify-content: flex-end;
  
    .el-col {
      margin-left: 10px;
  
      &:first-child {
        margin-left: 0;
      }
    }
  }
  
  /* 输入框统一样式 */
  .el-input,
  .el-date-editor {
    width: 100%;
  }
  
  /* 按钮间距调整 */
  .el-button+.el-button {
    margin-left: 10px;
  }
  
  /* 搜索按钮样式 */
  .search-button {
    margin-left: 10px;
  }
  
  .toolbar {
    margin-bottom: 15px;
  }
  
  .search-filters {
    margin: 15px 0;
  }
  
  .upload-demo {
    display: inline-block;
    margin-left: 10px;
  }
  
  .centered-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    /* 确保按钮宽度填满单元格 */
    box-sizing: border-box;
    /* 确保padding不会影响宽度 */
    text-align: center;
    /* 文本居中 */
  }
  
  .table-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }
  
  .pagination {
    margin-top: 20px;
    justify-content: flex-end;
  }
  
  .content {
    padding: 20px;
  }
  
  .dashboard {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  
  .stats {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }
  
  .stat-card {
    text-align: center;
    padding: 20px;
  }
  
  .value {
    font-size: 24px;
    color: #409EFF;
    margin-top: 10px;
  }
  
  .charts {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }
  
  .chart-container {
    height: 400px;
    /* 必须设置明确高度 */
    width: 100%;
  }
  
  .chart-card {
    padding: 20px;
  }
  
  .table-card {
    margin-top: 20px;
  }
  
  .loading {
    text-align: center;
    padding: 20px;
    color: #666;
  }
  
  .error {
    color: #ff4444;
    padding: 20px;
    text-align: center;
  }
  </style>
  
  