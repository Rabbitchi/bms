<template>
  <div class="customer-management">
    <el-card class="table-card">

      <el-table :data="paginatedData" border stripe style="width: 100%" v-loading="loading">
        <el-table-column type="index" :index="(index)=>(pageSize*(currentPage-1)+index)+1" label="序号" width="60" />
        <template v-for="(value, key) in tableHeaders" :key="key">
          <el-table-column :prop="key" :label="value" sortable min-width="60" />
        </template>
      </el-table>

      <el-pagination
        class="pagination"
        background
        layout="prev, pager, next"
        :total="data.length"
        :page-size="pageSize"
        :current-page="currentPage"
        @current-change="handlePageChange"
      />
    </el-card>
  </div>
</template>

  
<script lang="ts">
import { defineComponent, onMounted, ref, computed } from 'vue';
import { getCustomerList } from '@/api/customer';

export default defineComponent({
  name: 'CustomerManagement',
  setup() {
    const data = ref<any[]>([]);
    const loading = ref(false);
    const currentPage = ref(1);
    const pageSize = ref(20);

    const tableHeaders = {
      id: 'ID',
      name: '客户名称',
      remark: '备注',
    };

    // 计算当前页的数据
    const paginatedData = computed(() => {
      const start = (currentPage.value - 1) * pageSize.value;
      const end = start + pageSize.value;
      return data.value.slice(start, end);
    });

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

    // 处理页码变化
    const handlePageChange = (page: number) => {
      currentPage.value = page;
    };

    onMounted(() => {
      fetchData();
    });

    return {
      data,
      loading,
      tableHeaders,
      paginatedData,
      currentPage,
      pageSize,
      handlePageChange,
    };
  },
});
</script>

  

<style scoped>
.pagination {
  margin-top: 20px;
  text-align: right;
}
</style>

  
  