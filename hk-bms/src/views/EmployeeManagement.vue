<template>
    <div class="employee-management">
      <div class="table-header">
        <el-button type="primary" @click="showAddUserDialog">新增用户</el-button>
      </div>
      <el-table :data="data" border stripe style="width: 100%" v-loading="loading">
        <template v-for="(value, key) in tableHeaders" :key="key">
          <el-table-column :prop="key" :label="value" sortable min-width="60" />
        </template>
      </el-table>
      <el-dialog v-model="addUserDialogVisible" title="新增用户" width="500px">
        <el-form :model="newUser" :rules="userFormRules" ref="userForm">
          <el-form-item label="用户名" prop="employeeName">
            <el-input v-model="newUser.employeeName" placeholder="请输入2-20位用户名" />
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="newUser.password" type="password" placeholder="请输入6-20位密码" show-password />
          </el-form-item>
          <el-form-item label="用户类型" prop="userType">
            <el-select v-model="newUser.userType" placeholder="请选择用户类型">
              <el-option label="管理员 (0)" :value="0" />
              <el-option label="普通用户 (1)" :value="1" />
            </el-select>
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="addUserDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmAddUser">确认添加</el-button>
        </template>
      </el-dialog>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, onMounted, ref } from 'vue';
  import { getEmployeeList, addEmployee } from '@/api/employee';
  import { ElMessage } from 'element-plus';
  
  export default defineComponent({
    name: 'EmployeeManagement',
    setup() {
      const data = ref<any[]>([]);
      const loading = ref(false);
      const addUserDialogVisible = ref(false);
      const newUser = ref({
        employeeName: '',
        password: '',
        userType: null,
      });
      const userForm = ref<any>(null);
  
      const tableHeaders = {
        employeeId: '员工编号',
        employeeName: '姓名',
        password: '密码',
        userType: '用户类型',
      };
  
      const userFormRules = {
        employeeName: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在2到20个字符', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 20, message: '长度在6到20个字符', trigger: 'blur' },
        ],
        userType: [
          { required: true, message: '请选择用户类型', trigger: 'change' },
        ],
      };
  
      const fetchData = async () => {
        try {
          loading.value = true;
          const response = await getEmployeeList();
          data.value = response.data;
        } catch (error) {
          console.error('请求失败:', error);
        } finally {
          loading.value = false;
        }
      };
  
      const showAddUserDialog = () => {
        newUser.value = { employeeName: '', password: '', userType: null };
        addUserDialogVisible.value = true;
      };
  
      const confirmAddUser = async () => {
        try {
          await userForm.value.validate();
          const response = await addEmployee(newUser.value);
          if (response.data === 'success') {
            ElMessage.success('用户添加成功');
            addUserDialogVisible.value = false;
            fetchData();
          } else {
            ElMessage.error('用户添加失败');
          }
        } catch (error) {
          if (error.response) {
            ElMessage.error(`服务器错误: ${error.response.data.message}`);
          } else if (error.request) {
            ElMessage.error('网络连接异常，请检查网络');
          }
        }
      };
  
      onMounted(() => {
        fetchData();
      });
  
      return {
        data,
        loading,
        addUserDialogVisible,
        newUser,
        tableHeaders,
        userFormRules,
        showAddUserDialog,
        confirmAddUser,
        userForm,
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


  