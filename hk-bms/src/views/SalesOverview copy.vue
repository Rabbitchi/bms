<template>
    <div class="dashboard">
      <!-- 年份选择 -->
      <div class="year-selector">
        <el-select v-model="selectedYear" placeholder="选择年份" @change="handleYearChange" style="width: 120px">
          <el-option v-for="year in yearOptions" :key="year" :label="year" :value="year" />
        </el-select>
      </div>
      <!-- 展示框 -->
      <div class="stats">
        <el-card class="stat-card">
          <h3>年度总订单数</h3>
          <div class="value">{{ data.orderTotalNum?data.orderTotalNum: null }}</div>
        </el-card>
        <el-card class="stat-card">
          <h3>年度总销售额</h3>
          <div class="value">¥{{ data.orderTotalAmount?data.orderTotalAmount.toFixed(2): null }}</div>
        </el-card>
      </div>
       <!-- 图表 -->
      <div class="charts">
        <el-card class="chart-card">
          <h4>年度月销售变化趋势</h4>
          <div ref="barChartRef" class="chart-container"></div>
        </el-card>
        <el-card class="chart-card">
          <h4>销售员年度业绩分布</h4>
          <div ref="pieChartRef" class="chart-container"></div>
        </el-card>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref, onMounted, onBeforeUnmount } from 'vue';
  import { getSalesOverview } from '@/api/saleoverview';
  import { initBarChart, initPieChart } from '@/components/common/Charts';
  
  export default defineComponent({
    name: 'SalesOverview',
    setup() {
      const selectedYear = ref(new Date().getFullYear());
      const yearOptions = ref<number[]>([]);
      const data = ref<any>({});
      const barChartRef = ref<HTMLElement | null>(null);
      const pieChartRef = ref<HTMLElement | null>(null);
  
      const generateYearOptions = () => {
        const currentYear = new Date().getFullYear();
        for (let i = -6; i <= 0; i++) {
          yearOptions.value.push(currentYear + i);
        }
      };
  
      const fetchData = async () => {
        try {
          const response = await getSalesOverview(selectedYear.value);
          data.value = response.data;

          if (barChartRef.value && pieChartRef.value) {
            initBarChart(barChartRef.value, data.value);
            initPieChart(pieChartRef.value, data.value);
          }
        } catch (error) {
          console.error('请求失败:', error);
        }
      };
  
      const handleYearChange = () => {
        fetchData();
      };
  
      onMounted(() => {
        generateYearOptions();
        fetchData();
      });
  
      onBeforeUnmount(() => {
        // 清理图表实例
      });
  
      return {
        selectedYear,
        yearOptions,
        data,
        barChartRef,
        pieChartRef,
        handleYearChange,
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


  