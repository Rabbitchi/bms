<template>
  <div class="dashboard">
    <!-- 年份选择 -->
    <div class="time-selector">
      <el-select v-model="selectedYear" placeholder="选择年份" @change="handleYearChange" style="width: 120px">
        <el-option v-for="year in yearOptions" :key="year" :label="year" :value="year" />
      </el-select>
      <el-select v-model="selectedMonth" placeholder="选择月份" @change="handleMonthChange"
        style="width: 120px; margin-left: 10px">
        <el-option v-for="m in 12" :key="m" :label="`${m}月`" :value="m" />
      </el-select>
    </div>
    <!-- 核心指标看板 -->
    <div class="metric-board">
      <el-card class="metric-card">
        <div class="metric-title">年度总订单数</div>
        <div class="metric-value">{{ annualData.orderTotalNum || '--' }}</div>
      </el-card>
      <el-card class="metric-card">
        <div class="metric-title">年度总销售额</div>
        <div class="metric-value">¥{{ annualData.orderTotalAmount?.toFixed(2) || '--' }}</div>
      </el-card>
      <el-card class="metric-card">
        <div class="metric-title">月度订单数</div>
        <div class="metric-value highlight">{{ monthlyData.orderTotalNum || '--' }}</div>
      </el-card>
      <el-card class="metric-card">
        <div class="metric-title">月度销售额</div>
        <div class="metric-value highlight">¥{{ monthlyData.orderTotalAmount?.toFixed(2) || '--' }}</div>
      </el-card>
    </div>

    <!-- 图表区 -->
    <div class="chart-container">
      <!-- 年度趋势 -->
      <el-card class="main-chart">
        <h4>{{ selectedYear }}年销售趋势</h4>
        <div class="chart-tips">点击柱子查看当月详情</div>
        <div ref="trendChartRef" class="chart-content"></div>
      </el-card>

      <!-- 销售分布 -->
      <div class="side-charts">
        <el-card class="distribution-chart">
          <h4>年度销售分布</h4>
          <div ref="annualPieRef" class="chart-content"></div>
        </el-card>
        <el-card class="distribution-chart">
          <h4>{{ selectedMonth }}月销售分布</h4>
          <div ref="monthlyPieRef" class="chart-content"></div>
        </el-card>
      </div>
    </div>

  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { initTrendChart, initPieChart } from '@/components/common/Charts';
import { getYearSalesOverview, getMonthSalesOverview } from '@/api/saleoverview';
import type { ECharts } from 'echarts';
// import { da } from 'element-plus/es/locales.mjs';

const selectedYear = ref(new Date().getFullYear());
const yearOptions = ref<number[]>([]);

const selectedMonth = ref(new Date().getMonth() + 1)

const annualData = ref({
  orderTotalNum: 0,
  orderTotalAmount: 0,
  barCharts: [],
  pieCharts: []
});

const monthlyData = ref({
  orderTotalNum: 0,
  orderTotalAmount: 0,
  pieCharts: []
});
const trendChartRef = ref<HTMLElement | null>(null);
const annualPieRef = ref<HTMLElement | null>(null);
const monthlyPieRef = ref<HTMLElement | null>(null);

type ChartInstance = ECharts | null;
let trendChart: ChartInstance = null;
let annualPieChart: ChartInstance = null;
let monthlyPieChart: ChartInstance = null;


const generateYearOptions = () => {
  const currentYear = new Date().getFullYear();
  for (let i = -6; i <= 0; i++) {
    yearOptions.value.push(currentYear + i);
  }
};

// 获取年度数据
const fetchAnnualData = async () => {
  try {

    const { data } = await getYearSalesOverview(selectedYear.value);
    annualData.value = data;
    console.log('init fetchAnnualData data',data);
    console.log('init fetchAnnualData annualData.value',annualData.value);
    // 销毁旧图表
    trendChart?.dispose();
    annualPieChart?.dispose();

    // 初始化新图表
    if (trendChartRef.value && annualPieRef.value) {
      console.log('init fetchAnnualData');
      
      trendChart = initTrendChart(trendChartRef.value, data.barCharts, handleChartClick);
      annualPieChart = initPieChart(annualPieRef.value, data.pieCharts,data.orderTotalAmount,data.orderTotalNum);
    }
  } catch (error) {
    console.error('获取年度数据失败:', error);
  }

}

// 获取月度详情
const fetchMonthlyData = async () => {
  try {
    const { data } = await getMonthSalesOverview(selectedYear.value, selectedMonth.value);
    monthlyData.value = data;
    console.log('init fetchMonthlyData data',data);
    console.log('init fetchMonthlyData monthlyData.value',monthlyData.value);
    // 更新月度饼图
    monthlyPieChart?.dispose();
    if (monthlyPieRef.value) {
      monthlyPieChart = initPieChart(monthlyPieRef.value, data.pieCharts, data.orderTotalAmount,data.orderTotalNum);
    }
  } catch (error) {
    console.error('获取月度数据失败:', error);
  }
}

// 图表点击处理
const handleChartClick = (month: number) => {
  selectedMonth.value = month;
  fetchMonthlyData();
};
// 响应式调整图表尺寸
const handleResize = () => {
  [trendChart, annualPieChart, monthlyPieChart].forEach(chart => {
    chart?.resize();
  });
};


const handleYearChange = () => {
  fetchAnnualData();
};
const handleMonthChange = () => {
  fetchMonthlyData();
};

onMounted(() => {
  generateYearOptions();
  fetchAnnualData();
  fetchMonthlyData();
  window.addEventListener('resize', handleResize);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
  [trendChart, annualPieChart, monthlyPieChart].forEach(chart => {
    chart?.dispose();
  });
});

</script>


<style scoped>
.dashboard {
  padding: 20px;
  background: #f5f7fa;
}

/* 新增年份选择器样式 */
.time-selector {
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

.metric-board {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
  margin-bottom: 20px;
}

.metric-card {
  padding: 15px;
  transition: box-shadow 0.3s;
}

.metric-card:hover {
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.metric-title {
  color: #909399;
  font-size: 14px;
  margin-bottom: 8px;
}

.metric-value {
  font-size: 20px;
  color: #303133;
  font-weight: 600;
}

.highlight {
  color: #67C23A;
}

.chart-container {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
}

.main-chart {
  height: 500px;
}

.side-charts {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.distribution-chart {
  height: 240px;
}

.chart-content {
  height: 100%;
  min-height: 300px; /* 添加最小高度保障 */
}

.chart-tips {
  color: #909399;
  font-size: 12px;
  margin: 5px 0;
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
