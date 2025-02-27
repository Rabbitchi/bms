<template>
  <div class="content">
    <!-- 加载状态 -->
    <div v-if="loading" class="loading">加载中...</div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="error">{{ error }}</div>

    <!-- 销售概况 -->
    <div v-else-if="currentView === 'sales-overview'" class="dashboard">

      <!-- 年份选择 -->
      <div class="year-selector">
        <el-select v-model="selectedYear" placeholder="选择年份" @change="handleYearChange" style="width: 120px">
          <el-option v-for="year in yearOptions" :key="year" :label="year" :value="year" />
        </el-select>
      </div>
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

      <!-- 图表 -->
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

    <!-- 订单管理模块 -->
    <div v-else-if="currentView === 'order-management'">
      <div class="table-header">
        <el-row :gutter="20" class="toolbar" justify="space-between">
          <!-- 左侧按钮组 -->
          <el-col :span="16">
            <div class="button-group">
              <el-button type="primary" @click="showAddDialog">新增订单</el-button>
              <el-button @click="handleExport" style="margin-left: 10px">导出Excel</el-button>
              <!-- 在模板部分修改el-upload组件 -->
              <el-upload action="" :show-file-list="false" :http-request="handleImport" :before-upload="beforeImport"
                accept=".xlsx, .xls" style="margin-left: 10px">
                <el-button type="success">导入Excel</el-button>
              </el-upload>
            </div>
          </el-col>
        </el-row>
        <!-- 右侧搜索组 -->
        <el-row :gutter="10" class="search-filters" justify="end">
          <el-col :span="6">
            <el-date-picker v-model="dateRange" type="daterange" range-separator="至" start-placeholder="开始日期"
              style="width: 100%" end-placeholder="结束日期" value-format="YYYY-MM-DD" @change="handleDateChange" />
          </el-col>
          <!-- 公司名称下拉选择 -->
          <el-col :span="4">
            <el-select v-model="companyFilter" placeholder="公司名称" filterable clearable @change="handleSearch">
              <el-option v-for="company in companyOptions" :key="company.value" :label="company.label"
                :value="company.value" />
            </el-select>
          </el-col>

          <el-col :span="4">
            <el-select v-model="salesmanFilter" placeholder="销售员" filterable clearable @change="handleSearch">
              <el-option v-for="salesman in salesmanOptions" :key="salesman.value" :label="salesman.label"
                :value="salesman.value" />
            </el-select>
          </el-col>

          <el-col :span="3">
            <el-button type="primary" @click="handleSearch" style="width: 100%">搜索</el-button>
          </el-col>
        </el-row>
      </div>

      <el-card class="table-card">

        <el-table :data="data" border stripe style="width: 100%" v-loading="loading"
          @selection-change="handleSelectionChange">
          <!-- 复选框列 -->
          <el-table-column type="selection" width="55" align="center" />

          <template v-for="(value, key) in tableHeaders" :key="key">

            <!-- 单独处理 ID 列 -->
            <el-table-column v-if="key" :prop="key" :label="value" min-width="80">
              <template #default="{ row, $index }">
                <template v-if="editingIndex === $index">
                  <el-input v-model="editForm[key]" @blur="saveEdit(row)" />
                </template>
                <span v-else>{{ row[key] }}</span>
              </template>
            </el-table-column>
          </template>

          <el-table-column label="操作" width="60">
            <template #default="{ row, $index }">
              <el-button class="centered-button" size="small" type="success" @click="handleEdit(row, $index)"
                :icon="editingIndex === $index ? 'Check' : 'Edit'">编辑</el-button>

            </template>
          </el-table-column>
          <el-table-column label="操作" width="60">
            <template #default="{ row }">

              <el-button class="centered-button" size="small" type="danger" @click="handleDelete(row)"
                icon="Delete">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <el-pagination class="pagination" :current-page="currentPage" :page-size="pageSize" :total="total"
          @current-change="handlePageChange" layout="prev, pager, next" />
      </el-card>
    </div>

    <!-- 其他模块表格展示 -->
    <el-card v-else class="table-card">
      <el-table :data="data" border stripe style="width: 100%" v-loading="loading">
        <template v-for="(value, key) in tableHeaders" :key="key">
          <el-table-column :prop="key" :label="value" sortable min-width="60" />
        </template>
      </el-table>
    </el-card>

    <!-- 新增订单弹窗 -->
    <el-dialog v-model="addDialogVisible" title="新增订单" width="600px">
      <el-form :model="newOrder" label-width="100px">
        <el-form-item v-for="(_, key) in tableHeaders" :key="key" :label="tableHeaders[key]">
          <el-input v-model="newOrder[key]" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="addDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmAdd">确认添加</el-button>
      </template>
    </el-dialog>

  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, computed, onMounted, onBeforeUnmount, watchEffect } from 'vue'
import axios from 'axios'
import * as echarts from 'echarts'
import * as XLSX from 'xlsx'
import { ElMessage, ElMessageBox, ElLoading } from 'element-plus'
import { ElCard, ElTable, ElTableColumn } from 'element-plus'

// 表头中英文映射配置
const TABLE_HEADERS_MAP = {
  // 订单管理
  'order-management': {
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

    //(0)通用配置
    onMounted(() => {
      window.addEventListener('resize', resizeCharts)
      generateYearOptions()
      fetchData()
      // 只在订单管理界面加载下拉数据
      if (props.currentView === 'order-management') {
        fetchCompanies()
        fetchSalesmen()
      }
    })

    // 动态表头
    const tableHeaders = computed(() => {
      return TABLE_HEADERS_MAP[props.currentView as keyof typeof TABLE_HEADERS_MAP] || {}
    })



    //(1)销售概况相关

    // 年份状态
    const selectedYear = ref(new Date().getFullYear())
    const yearOptions = ref<number[]>([])
    const generateYearOptions = () => {
      const currentYear = new Date().getFullYear()
      for (let i = -6; i <= 0; i++) {
        yearOptions.value.push(currentYear + i)
      }
    }
    // 处理年份变化
    const handleYearChange = () => {
      fetchData()
    }


    //图表实例
    const data = ref<any>({})
    const loading = ref(false)
    const error = ref('')
    // 使用 Vue ref 绑定 DOM 元素
    const barChartRef = ref(null)
    const pieChartRef = ref(null)

    let barChart: echarts.ECharts | null = null
    let pieChart: echarts.ECharts | null = null

    // (2)订单管理相关


  

    const total = ref(0)



    const fetchData = async () => {
      try {
        loading.value = true
        error.value = ''
        const apiMap = {
          'sales-overview': 'boards/show',
          'order-management': 'order/pageFind',
          'customer-management': 'customer/show',
          'employee-management': 'employee/show'
        }

        // 初始化图表
        if (props.currentView === 'sales-overview') {
          const response = await axios.get(
            `http://localhost:8086/boards/show?year=${selectedYear.value}`
          )
          data.value = response.data
          // 等待 DOM 更新完成
          watchEffect(() => {
            initCharts();
          })
        } else if (props.currentView === 'order-management') {
          const params = {
            page: currentPage.value - 1, // 后端页码从0开始
            size: pageSize.value,
          }
          const response = await axios.get(`http://localhost:8086/${apiMap[props.currentView]}`, { params })
          data.value = response.data.page
          total.value = response.data.pageTotal
        } else {
          const response = await axios.get(
            `http://localhost:8086/${apiMap[props.currentView]}`
          )
          data.value = response.data
        }



      } catch (err) {
        error.value = '数据加载失败，请稍后重试'
        console.error('请求失败:', err)
      } finally {
        loading.value = false
      }
    }

    // 图表初始化
    const initCharts = () => {
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
        barChart = echarts.init(barChartRef.value)
        pieChart = echarts.init(pieChartRef.value)
        // 配置图表选项
        barChart.setOption({
          xAxis: {
            name: '月份',
            type: 'category',
            data: data.value.barCharts.map(item => item.month)
          },
          yAxis: {
            name: '销售额',
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
            text: '销售员业绩分布',
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
              name: '销售额',
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


    const companyOptions = ref<{ value: string, label: string }[]>([]);

    const salesmanOptions = ref<{ value: string, label: string }[]>([]);
    const fetchCompanies = async () => {

      try {
        const response = await axios.get('http://localhost:8086/customer/getNameList');
        companyOptions.value = response.data.map((item: any) => ({
          value: item,
          label: item
        }));
      } catch (err) {
        console.error('获取公司列表失败:', err)
        ElMessage.error('公司列表加载失败')
      }
    }

    const fetchSalesmen = async () => {

      try {
        const response = await axios.get('http://localhost:8086/employee/getNameList');
        salesmanOptions.value = response.data.map((item: any) => ({
          value: item,
          label: item
        }));
      } catch (err) {
        console.error('获取销售员列表失败:', err)
        ElMessage.error('销售员列表加载失败')
      }
    }

    onBeforeUnmount(() => {
      window.removeEventListener('resize', resizeCharts)
      barChart?.dispose()
      pieChart?.dispose()
    })

    watch(() => props.currentView, (newVal) => {
      if (newVal === 'order-management') {
        fetchCompanies()
        fetchSalesmen()
      }
      fetchData()
    }, { immediate: true })

    const currentPage = ref(1)
    const pageSize = ref(10)
    const editingIndex = ref(-1)
    const editForm = ref<any>({})
    const addDialogVisible = ref(false)
    const newOrder = ref<any>({})

    // 分页数据计算
    // const paginatedData = computed(() => {
    //   const start = (currentPage.value - 1) * pageSize.value
    //   const end = start + pageSize.value
    //   return data.value.slice(start, end)
    // })

    // 编辑操作
    const handleEdit = (row: any, index: number) => {
      if (editingIndex.value === index) {
        editingIndex.value = -1
      } else {
        editingIndex.value = index
        editForm.value = { ...row }
      }
    }

    // 保存编辑
    const saveEdit = async (original: any) => {
      try {
        await axios.put(`http://localhost:8086/order/update`, editForm.value)
        Object.assign(original, editForm.value)
        ElMessage.success('修改成功')
      } catch (err) {
        ElMessage.error('修改失败')
      } finally {
        editingIndex.value = -1
      }
    }

    // 删除操作
    const handleDelete = (row: any) => {
      ElMessageBox.confirm('确认删除该订单？', '警告', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await axios.delete(`http://localhost:8086/order/delete?orderId=${row.orderId}`)
        data.value = data.value.filter((item: any) => item.id !== row.id)
        ElMessage.success('删除成功')
      })
    }

    // 新增订单
    const showAddDialog = () => {
      newOrder.value = {}
      addDialogVisible.value = true
    }

    const confirmAdd = async () => {
      try {
        await axios.post('http://localhost:8086/order/add', newOrder.value)
        await fetchData()
        addDialogVisible.value = false
        ElMessage.success('添加成功')
      } catch (err) {
        ElMessage.error('添加失败')
      }
    }

    // 分页变化处理
    const handlePageChange = (val: number) => {
      currentPage.value = val
      fetchData() // 切换页码时重新请求
    }


    // 新增搜索状态
    const searchQuery = ref('')
    const dateRange = ref([])
    const companyFilter = ref('')
    const salesmanFilter = ref('')
    const selectedRows = ref<any[]>([])

    // 处理复选框选择
    const handleSelectionChange = (val: any[]) => {
      selectedRows.value = val
    }

    // 处理搜索
    const handleSearch = () => {
      currentPage.value = 1
      fetchData()
    }

    // 处理日期筛选
    const handleDateChange = () => {
      currentPage.value = 1
      fetchData()
    }

    // 计算过滤后的数据
    const filteredData = computed(() => {
      return data.value.filter(item => {
        const matchesSearch = Object.values(item).some(value =>
          String(value).toLowerCase().includes(searchQuery.value.toLowerCase())
        )

        const matchesDate = !dateRange.value?.length || (
          new Date(item.startDate) >= new Date(dateRange.value[0]) &&
          new Date(item.startDate) <= new Date(dateRange.value[1])
        )

        const matchesCompany = !companyFilter.value ||
          item.company?.includes(companyFilter.value)

        const matchesSalesman = !salesmanFilter.value ||
          item.salesman?.includes(salesmanFilter.value)

        return matchesSearch && matchesDate && matchesCompany && matchesSalesman
      })
    })

    // 分页数据（基于过滤后的数据）
    const filteredPaginatedData = computed(() => {
      const start = (currentPage.value - 1) * pageSize.value
      const end = start + pageSize.value
      return filteredData.value.slice(start, end)
    })

    // 导出Excel
    // const handleExport = () => {
    //   const worksheet = XLSX.utils.json_to_sheet(filteredData.value)
    //   const workbook = XLSX.utils.book_new()
    //   XLSX.utils.book_append_sheet(workbook, worksheet, '订单数据')
    //   XLSX.writeFile(workbook, `订单数据_${new Date().toISOString()}.xlsx`)
    // }
    const handleExport = async () => {
      try {
        if (selectedRows.value.length > 0) {
          // 导出选中行（前端导出）
          const worksheet = XLSX.utils.json_to_sheet(selectedRows.value)
          const workbook = XLSX.utils.book_new()
          XLSX.utils.book_append_sheet(workbook, worksheet, '订单数据')
          XLSX.writeFile(workbook, `选中订单_${new Date().toISOString()}.xlsx`)
          ElMessage.success('导出成功')
        } else {
          // 导出全部（后端导出）
          const params = {
            startDate: dateRange.value?.[0],
            endDate: dateRange.value?.[1],
            company: companyFilter.value,
            salesman: salesmanFilter.value
          }

          const response = await axios.get('http://localhost:8086/order/export', {
            params,
            responseType: 'blob' // 关键：指定响应类型为二进制
          })

          // 创建下载链接
          const url = window.URL.createObjectURL(new Blob([response.data]))
          const link = document.createElement('a')
          link.href = url
          link.setAttribute('download', `订单导出_${new Date().toISOString()}.xlsx`)
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          ElMessage.success('导出成功')
        }
      } catch (err) {
        console.error('导出失败:', err)
        ElMessage.error('导出失败')
      }
    }


    // 导入处理方法
    const handleImport = async (options: any) => {
      let loadingInstance: ReturnType<typeof ElLoading.service> | null = null // 明确类型定义
      try {
        const formData = new FormData()
        formData.append('file', options.file)

        loadingInstance = ElLoading.service({
          lock: true,
          text: '正在导入，请稍候...',
          background: 'rgba(0, 0, 0, 0.7)'
        })

        const response = await axios.post('http://localhost:8086/order/import', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            // 如果有需要可以添加认证头
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })

        if (response.data.code === 200) {
          ElMessage.success('导入成功')
          await fetchData()
        } else {
          ElMessage.error(`导入失败：${response.data.message}`)
        }
      } catch (err) {
        console.error('导入失败:', err)
        ElMessage.error('文件导入失败，请检查文件格式或联系管理员')
      } finally {
        if (loadingInstance) {
          loadingInstance.close()
        }
      }
    }



    // 完善beforeImport校验
    const beforeImport = (file: File) => {
      const isExcel = file.type.includes('sheet') ||
        ['xlsx', 'xls'].includes(file.name.split('.').pop() || '')
      const isLt10M = file.size / 1024 / 1024 < 10

      if (!isExcel) {
        ElMessage.error('只能上传Excel文件!')
        return false
      }
      if (!isLt10M) {
        ElMessage.error('文件大小不能超过10MB!')
        return false
      }
      return true
    }

    // 导入成功处理
    const handleImportSuccess = (response: any) => {
      if (response.code === 200) {
        ElMessage.success('导入成功')
        fetchData()
      } else {
        ElMessage.error('导入失败: ' + response.message)
      }
    }


    return {
      companyOptions,
      salesmanOptions,
      selectedYear,
      yearOptions,
      handleYearChange,
      data, loading, error, tableHeaders, barChartRef,
      pieChartRef,
      fetchData,
      currentPage,
      pageSize,
      handleEdit,
      handleDelete,
      editingIndex,
      editForm,
      addDialogVisible,
      newOrder,
      showAddDialog,
      confirmAdd,
      handlePageChange,
      searchQuery,
      dateRange,
      companyFilter,
      salesmanFilter,
      selectedRows,
      handleSelectionChange,
      handleSearch,
      handleDateChange,
      filteredPaginatedData,
      handleExport,
      beforeImport,
      handleImport,
      handleImportSuccess
    }
  }
})
</script>

<style scoped>
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