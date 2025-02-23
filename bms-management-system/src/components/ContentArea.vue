<template>
  <div class="content">
    <!-- 加载状态 -->
    <div v-if="loading" class="loading">加载中...</div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="error">{{ error }}</div>

    <!-- 销售概况 -->
    <div v-else-if="currentView === 'sales-overview'" class="dashboard">
      <div class="stats">
        <el-card class="stat-card">
          <h3>总订单数</h3>
          <div class="value">{{ data.orderTotalNum }}</div>
        </el-card>
        <el-card class="stat-card">
          <h3>总销售额</h3>
          <div class="value">¥{{ data.orderTotalAmount.toFixed(2) }}</div>
        </el-card>
      </div>

      <div class="charts">
        <el-card class="chart-card">
          <h4>月度销售趋势</h4>
          <div ref="barChartRef" class="chart-container"></div>
        </el-card>
        <el-card class="chart-card">
          <h4>销售员业绩分布</h4>
          <div ref="pieChartRef" class="chart-container"></div>
        </el-card>
      </div>
    </div>

    <!-- 其他模块表格展示 -->
    <el-card v-else class="table-card">
      <el-table :data="data" border stripe style="width: 100%" v-loading="loading">
        <template v-for="(value, key) in tableHeaders" :key="key">
          <el-table-column :prop="key" :label="value" sortable min-width="150" />
        </template>
      </el-table>
    </el-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
import axios from 'axios'
import * as echarts from 'echarts'
import { ElCard, ElTable, ElTableColumn } from 'element-plus'

// 表头中英文映射配置
const TABLE_HEADERS_MAP = {
  // 订单管理
  'order-management': {
    id: 'ID',
    orderId: '订单编号',
    startDate: '开始日期',
    salesman: '销售员',
    company: '公司名称',
    item: '项目名称',
    model: '型号',
    num: '数量',
    expectDate: '预计完成日期',
    actualDate: '实际完成日期',
    testResult: '检测结果',
    remark: '备注',
    amountReceivable: '应收金额',
    amountCollected: '实收金额',
    paymentDate: '付款日期',
    changeReason: '变更原因',
    reportId: '报告编号'
  },
  // 客户管理
  'customer-management': {
    id: 'ID',
    name: '客户名称',
    remark: '备注'
  },
  // 用户管理
  'employee-management': {
    id: 'ID',
    employeeId: '员工编号',
    employeeName: '姓名',
    password: '密码',
    userType: '用户类型'
  }
}

export default defineComponent({
  components: { ElCard, ElTable, ElTableColumn },
  props: {
    currentView: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const data = ref<any>({})
    const loading = ref(false)
    const error = ref('')
    // 使用 Vue ref 绑定 DOM 元素
    const barChartRef = ref(null)
    const pieChartRef = ref(null)

    let barChart: echarts.ECharts | null = null
    let pieChart: echarts.ECharts | null = null

    // 动态表头
    const tableHeaders = computed(() => {
      return TABLE_HEADERS_MAP[props.currentView as keyof typeof TABLE_HEADERS_MAP] || {}
    })

    const fetchData = async () => {
      try {
        loading.value = true
        error.value = ''
        const apiMap = {
          'sales-overview': 'boards/show',
          'order-management': 'order/show',
          'customer-management': 'customer/show',
          'employee-management': 'employee/show'
        }

        const response = await axios.get(
          `http://localhost:8086/${apiMap[props.currentView]}`
        )
        data.value = response.data

        // 初始化图表
        if (props.currentView === 'sales-overview') {
          await initCharts()
        }

      } catch (err) {
        error.value = '数据加载失败，请稍后重试'
        console.error('请求失败:', err)
      } finally {
        loading.value = false
      }
    }

    // 图表初始化
    const initCharts = async () => {
      // 等待 DOM 更新完成
      await nextTick()
      // 销毁旧实例
      if (barChart) {
        barChart.dispose()
        barChart = null
      }
      if (pieChart) {
        pieChart.dispose()
        pieChart = null
      }
      // 初始化新实例（添加空值检查）

      if (barChartRef.value && pieChartRef.value) {
        console.log('init charts')
        barChart = echarts.init(barChartRef.value)
        pieChart = echarts.init(pieChartRef.value)

        // 配置图表选项
        barChart.setOption({
          xAxis: {
            type: 'category',
            data: data.value.barCharts.map(item => item.month)
          },
          yAxis: {
            type: 'value'
          },
          series: [
            {
              data: data.value.barCharts.map(item => item.saleAmount),
              type: 'line'
            }
          ]
        })

        pieChart.setOption({


          color: ['#3398DB', '#FF9900', '#1E90FF', '#FF4500', '#FF8C00', '#B8860B', '#CD5C5C', '#483D8B'],

          title: {
            text: 'Referer of a Website',
            subtext: 'Fake Data',
            left: 'center'
          },
          tooltip: {
            trigger: 'item'
          },
          legend: {
            orient: 'vertical',
            left: 'left'
          },
          series: [
            {
              name: '销售员业绩',
              type: 'pie',
              radius: '50%',
              data: data.value.pieCharts.map(item => ({ name: item.saleName, value: item.orderAmount })),
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]

        })
      }
    }



    // 响应式调整图表
    const resizeCharts = () => {
      barChart?.resize()
      pieChart?.resize()
    }

    onMounted(() => {
      window.addEventListener('resize', resizeCharts)
      fetchData()
    })

    onBeforeUnmount(() => {
      window.removeEventListener('resize', resizeCharts)
      barChart?.dispose()
      pieChart?.dispose()
    })

    watch(() => props.currentView, fetchData, { immediate: true })

    return {
      data, loading, error, tableHeaders, barChartRef,
      pieChartRef,
      fetchData
    }
  }
})
</script>

<style scoped>
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