<template>
  <div class="order-management">
    <div class="table-header">
      <el-row :gutter="20" class="toolbar" justify="space-between">
        <el-col :span="16">
          <div class="button-group">
            <el-button type="primary" @click="showAddDialog">新增订单</el-button>
            <el-button @click="handleExport" style="margin-left: 10px">导出Excel</el-button>
            <el-upload action="" :show-file-list="false" :http-request="handleImport" :before-upload="beforeImport"
              accept=".xlsx, .xls" style="margin-left: 10px">
              <el-button type="success">导入Excel</el-button>
            </el-upload>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="10" class="search-filters" justify="end">
        <!-- 付款状态过滤 -->
        <el-col :span="3">
          <el-select v-model="paymentFilter" placeholder="是否付款" clearable>
            <el-option label="全部" value="" />
            <el-option label="已付款" value="paid" />
            <el-option label="未付款" value="unpaid" />
          </el-select>
        </el-col>
        <!-- 状态过滤和关键字搜索 -->
        <el-col :span="3">
          <el-select v-model="statusFilter" placeholder="订单状态" clearable>
            <el-option label="全部" value="all" />
            <el-option label="已完成" value="completed" />
            <el-option label="未完成" value="uncompleted" />
          </el-select>
        </el-col>
        <!-- 项目搜索 -->
        <el-col :span="4">
          <el-input v-model="keywordFilter" placeholder="项目搜索" clearable @keyup.enter="handleSearch" />
        </el-col>

        <!-- 日期范围搜索 -->
        <el-col :span="5">
          <el-date-picker v-model="dateRange" type="daterange" range-separator="至" start-placeholder="开始日期"
            style="width: 100%" end-placeholder="结束日期" value-format="YYYY-MM-DD" />
        </el-col>
        <!-- 公司名称搜索 -->
        <el-col :span="3">
          <el-select v-model="companyFilter" placeholder="公司名称" filterable clearable>
            <el-option v-for="company in companyOptions" :key="company.value" :label="company.label"
              :value="company.value" />
          </el-select>
        </el-col>
        <!-- 销售员搜索 -->
        <el-col :span="3">
          <el-select v-model="salesmanFilter" placeholder="销售员" filterable clearable>
            <el-option v-for="salesman in salesmanOptions" :key="salesman.value" :label="salesman.label"
              :value="salesman.value" />
          </el-select>
        </el-col>
        <!-- 搜索按钮 -->
        <el-col :span="3">
          <el-button type="primary" @click="handleSearch" style="width: 100%">搜索</el-button>
        </el-col>
      </el-row>
    </div>
    <!-- 订单列表 -->
    <el-card class="table-card">
      <el-table :data="orderData" :cell-style="handleCellStyle" :row-class-name="handleRowClass" border stripe
        style="width: 100%" v-loading="loading" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="40" align="center" />
        <el-table-column type="index" :index="(index) => (currentPage - 1) * pageSize + index + 1" label="序号" width="60"
          align="center" />

        <template v-for="(value, key) in tableHeaders" :key="key">
          <!-- <el-table-column v-if="key !== 'status' && key" :prop="key" :label="value" min-width="80">
            <template #default="{ row, $index }">
              
              <template v-if="editingIndex === $index">
                <el-input v-model="editForm[key]" />
              </template>
              <span v-else>{{ row[key] }}</span>
            </template>
          </el-table-column> -->

          <el-table-column :prop="key" :label="value" min-width="80">
            <template #default="{ row, $index }">
              <!-- 可编辑单元格 -->
              <div v-if="editingCell?.rowIndex === $index && editingCell?.colKey === key" class="cell-edit">
                <el-input 
                  v-model="editForm[key]" 
                  @blur="handleCellBlur(row)"
                  v-focus
                  size="small"
                />
              </div>
              <!-- 显示内容 -->
              <div v-else class="cell-content" @dblclick.stop="handleCellDblClick(row, $index, key, $event)">
                <template v-if="key === 'status'">
                  <span :style="statusStyle(row.status)">{{ row.status }}</span>
                </template>
                <template v-else>
                  {{ row[key] }}
                </template>
              </div>
            </template>
          </el-table-column>



        </template>

        <!-- 状态列 -->
        <el-table-column prop="status" label="完成状态">
          <template #default="{ row, $index }">
            <template v-if="editingIndex === $index">
              <el-input v-model="editForm.status" />
            </template>
            <span v-else :style="statusStyle(row.status)">{{ row.status }}</span>
          </template>
        </el-table-column>

        <!-- 操作列 -->
        <!-- <el-table-column label="操作" width="60">
          <template #default="{ row, $index }">
            <el-button class="centered-button" size="small" type="success" @click="handleEdit(row, $index)"
              :icon="editingIndex === $index ? 'Check' : 'Edit'">{{ editingIndex === $index ? '保存' : '编辑' }}</el-button>
          </template>
        </el-table-column> -->
        <el-table-column label="操作" width="60">
          <template #default="{ row }">
            <el-button class="centered-button" size="small" type="danger" @click="handleDelete(row)"
              icon="Delete">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 底部分页 -->
      <el-pagination class="pagination" :current-page="currentPage" :page-size="pageSize" :total="total"
        @current-change="handlePageChange" layout="prev, pager, next" />
    </el-card>
    <!-- 新增订单对话框 -->
    <el-dialog v-model="addDialogVisible" title="新增订单" width="600px">
      <el-form :model="newOrder" label-width="100px">
        <template v-for="(label, key) in tableHeaders" :key="key">
          <!-- 订单编号（带必填提示） -->
          <el-form-item v-if="key === 'orderId'" :label="label" prop="orderId" required>
            <div class="form-item-with-tip">
              <el-input v-model="newOrder[key]" />
              <span class="required-tip"></span>
            </div>
          </el-form-item>

          <!-- 所有日期字段使用选择器 -->
          <el-form-item v-if="isDateField(key)" :label="label">
            <el-date-picker v-model="newOrder[key]" type="date" value-format="YYYY-MM-DD"
              :placeholder="getDatePlaceholder(key)" style="width: 100%" />
          </el-form-item>

          <!-- 公司名称改为下拉选择 -->
          <el-form-item v-if="key === 'company'" :label="label">
            <el-select v-model="newOrder.company" filterable clearable placeholder="请选择公司" style="width: 100%">
              <el-option v-for="item in companyOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <!-- 销售员改为下拉选择 -->
          <el-form-item v-if="key === 'salesman'" :label="label">
            <el-select v-model="newOrder.salesman" filterable clearable placeholder="请选择销售员" style="width: 100%">
              <el-option v-for="item in salesmanOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <!-- 完成状态设置默认值并隐藏 -->
          <el-form-item v-if="key === 'status'" :label="label" style="display: none">
            <el-input v-model="newOrder.status" :value="newOrder.status || '未完成'" />
          </el-form-item>

          <!-- 其他字段保持原样 -->
          <el-form-item 
          v-if="key !== 'company' && key !== 'salesman' && key !== 'orderId' && key !== 'status' && key !== 'startDate' && key !== 'expectDate' && key !== 'actualDate' && key !== 'paymentDate'" 
          :label="label">
            <el-input v-model="newOrder[key]" />
          </el-form-item>



        </template>
      </el-form>
      <template #footer>
        <el-button @click="addDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmAdd">确认添加</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { getOrderList, addOrder, updateOrder, deleteOrder, exportOrder, importOrder } from '@/api/order';
import { getSalesmanList } from '@/api/employee';
import { getCustomerNameList } from "@/api/customer";
import { ElMessage, ElMessageBox, ElLoading } from 'element-plus';
import * as XLSX from 'xlsx';

    const currentPage = ref(1);
    const pageSize = ref(10);
    const total = ref(0);
    const orderData = ref<any[]>([]);
    const loading = ref(false);
    const dateRange = ref([]);
    const companyFilter = ref('');
    const salesmanFilter = ref('');
    const selectedRows = ref<any[]>([]);
    const editingIndex = ref(-1);
  
    const addDialogVisible = ref(false);
    const newOrder = ref<any>({
      status: '未完成',
      orderId: '',         // 必填项
      startDate: '',       // 必填
      expectDate: '',      // 必填
      actualDate: null,    // 可选
      paymentDate: null    // 可选
    });
    const companyOptions = ref<{ value: string, label: string }[]>([]);
    const salesmanOptions = ref<{ value: string, label: string }[]>([]);

    const statusFilter = ref('all');
    const keywordFilter = ref('');
    const paymentFilter = ref('');

    //编辑列新逻辑
    interface EditingCell {
  rowIndex: number;
  colKey: string;
}
const editingCell = ref<EditingCell | null>(null);
const editForm = ref<any>({});
// 双击单元格处理
const handleCellDblClick = (row: any, rowIndex: number, columnKey: string) => {
  // 过滤不可编辑列
  const unEditableColumns = ['selection', 'index', '操作'];
  if (unEditableColumns.includes(columnKey)) return;

  editingCell.value = { rowIndex, colKey: columnKey };
  editForm.value = { ...row };
};
// 失焦保存处理
const handleCellBlur = async (originalRow: any) => {
  if (!editingCell.value) return;

  try {
    // 检查是否有修改
    const hasChanges = Object.keys(editForm.value).some(
      key => editForm.value[key] !== originalRow[key]
    );

    if (hasChanges) {
      const response = await updateOrder(editForm.value);
      if (response.data === 'success') {
        Object.assign(originalRow, editForm.value);
        ElMessage.success('修改保存成功');
      }
    }
  } catch (error) {
    ElMessage.error('修改保存失败');
  } finally {
    editingCell.value = null;
  }
};
// 自定义自动聚焦指令
const vFocus = {
  mounted: (el: HTMLElement) => el.querySelector('input')?.focus()
};
    // 在setup中添加日期字段判断方法
const isDateField = (key: string) => {
  return ['startDate', 'expectDate', 'actualDate', 'paymentDate'].includes(key);
};

const getDatePlaceholder = (key: string) => {
  const map: Record<string, string> = {
    startDate: '选择开始日期',
    expectDate: '选择预计完成日期',
    actualDate: '选择实际完成日期（可选）',
    paymentDate: '选择付款日期（可选）'
  };
  return map[key] || '选择日期';
};

    const tableHeaders = {
      orderId: '订单编号',
      startDate: '开始日期',
      salesman: '销售员',
      company: '公司名称',
      item: '项目名称',
      model: '型号',
      num: '数量',
      unit: '单位',
      expectDate: '预计完成日期',
      actualDate: '实际完成日期',
      testResult: '检测结果',
      remark: '备注',
      amountReceivable: '应收金额',
      amountCollected: '实收金额',
      paymentDate: '付款日期',
      changeReason: '变更原因',
      status: '完成状态',
    };

    // 完成状态样式
    const statusStyle = (status: string) => {
      const style: any = {
        padding: '4px 8px',
        borderRadius: '4px',
        display: 'inline-block'
      }

      if (status === '已完成') {
        style.backgroundColor = '#e8f5e9';
        style.color = '#2e7d32';
      } else if (status === '未完成') {
        style.backgroundColor = '#ffebee';
        style.color = '#c62828';
      }
      return style;
    }

    // 统一单元格样式
    const handleCellStyle = ({ column, row }: { column: any, row: any }) => {
      if (column.property === 'status') {
        return { padding: '4px' };
      }
      return {};
    }



    // 未付款高亮
    const handleRowClass = ({ row }: { row: any }) => {
      if (row.amountReceivable > row.amountCollected) {
        return 'amount-warning-row';
      }
      return '';
    }

    const fetchData = async () => {
      try {
        loading.value = true;
        const params = {
          page: currentPage.value - 1,
          size: pageSize.value,
          startDate: dateRange.value[0] || '',
          endDate: dateRange.value[1] || '',
          company: companyFilter.value,
          salesman: salesmanFilter.value,
          status: statusFilter.value || "all",
          keyword: keywordFilter.value,
          paymentStatus: paymentFilter.value || ''
        };
        console.log('请求参数:', params);

        const response = await getOrderList(params);
        orderData.value = response.data.records;
        total.value = response.data.total;
      } catch (error) {
        console.error('请求失败:', error);
      } finally {
        loading.value = false;
      }
    };
 //编辑列
    // const handleEdit = async (row: any, index: number) => {
    //   if (editingIndex.value === index) {
    //     // 当前处于编辑状态，点击保存按钮
    //     try {
    //       const response = await updateOrder(editForm.value);
    //       if (response.data === 'success') {
    //         Object.assign(row, editForm.value); // 直接更新当前行数据
    //         ElMessage.success('修改成功');
    //       } else {
    //         ElMessage.error('修改失败');
    //       }
    //     } catch (error) {
    //       ElMessage.error('修改失败');
    //     }
    //     editingIndex.value = -1;
    //   } else {
    //     editingIndex.value = index;
    //     editForm.value = { ...row };
    //   }
    // };
   //删除订单列
    const handleDelete = (row: any) => {
      ElMessageBox.confirm('确认删除该订单？', '警告', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        const response = await deleteOrder(row.orderId);
        if (response.data === 'success') {
          ElMessage.success('删除成功');
          fetchData();
        } else {
          ElMessage.error('删除失败');
        }
      });
    };

    const showAddDialog = () => {
      newOrder.value = { status: '未完成' };
      addDialogVisible.value = true;
    };

    const confirmAdd = async () => {
      try {
        const response = await addOrder(newOrder.value);
        if (response.data === 'success') {
          ElMessage.success('添加成功');
          await fetchData();
          addDialogVisible.value = false;
        } else {
          ElMessage.error('添加失败');
        }
      } catch (error) {
        ElMessage.error('添加失败');
      }
    };


    //  导入导出功能
    const handleExport = async () => {
      try {
        if (selectedRows.value.length > 0) {
          const worksheet = XLSX.utils.json_to_sheet(selectedRows.value);
          const workbook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(workbook, worksheet, '订单数据');
          XLSX.writeFile(workbook, `选中订单_${new Date().toISOString()}.xlsx`);
          ElMessage.success('导出成功');
        } else {
          const params = {
            startDate: dateRange.value?.[0],
            endDate: dateRange.value?.[1],
            company: companyFilter.value,
            salesman: salesmanFilter.value,
            status: statusFilter.value,
            keyword: keywordFilter.value,
            paymentStatus: paymentFilter.value
          };
          const response = await exportOrder(params);
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', `订单导出_${new Date().toISOString()}.xlsx`);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          ElMessage.success('导出成功');
        }
      } catch (error) {
        console.error('导出失败:', error);
        ElMessage.error('导出失败');
      }
    };

    const handleImport = async (options: any) => {
      let loadingInstance: ReturnType<typeof ElLoading.service> | null = null;
      try {
        const formData = new FormData();
        formData.append('file', options.file);
        loadingInstance = ElLoading.service({
          lock: true,
          text: '正在导入，请稍候...',
          background: 'rgba(0, 0, 0, 0.7)',
        });
        const response = await importOrder(formData);

        if (response.status === 200) {
          ElMessage.success(`${response.data}`);
          await fetchData();
        } else {
          ElMessage.error(`${response.data}`);
        }
      } catch (error) {
        console.error('导入失败:', error);
        ElMessage.error('文件导入失败，请检查文件格式或联系管理员');
      } finally {
        if (loadingInstance) {
          loadingInstance.close();
        }
      }
    };

    const beforeImport = (file: File) => {
      const isExcel = file.type.includes('sheet') || ['xlsx', 'xls'].includes(file.name.split('.').pop() || '');
      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isExcel) {
        ElMessage.error('只能上传Excel文件!');
        return false;
      }
      if (!isLt10M) {
        ElMessage.error('文件大小不能超过10MB!');
        return false;
      }
      return true;
    };
   //搜索条件下拉框数据
    const fetchSalesmen = async () => {
      try {
        const response = await getSalesmanList();
        salesmanOptions.value = response.data.map((item: any) => ({
          value: item,
          label: item,
        }));
      } catch (error) {
        console.error('获取销售员列表失败:', error);
        ElMessage.error('销售员列表加载失败');
      }
    };


    const fetchCompanies = async () => {

      try {
        const response = await getCustomerNameList();
        companyOptions.value = response.data.map((item: any) => ({
          value: item,
          label: item
        }));
      } catch (err) {
        console.error('获取公司列表失败:', err)
        ElMessage.error('公司列表加载失败')
      }
    }
    const handlePageChange = (val: number) => {
      currentPage.value = val;
      fetchData();
    };

    const handleSelectionChange = (val: any[]) => {
      selectedRows.value = val;
    };

    const handleSearch = () => {
      currentPage.value = 1;
      fetchData();
    };
    onMounted(() => {
      fetchData();
      fetchSalesmen();
      fetchCompanies();
    });
</script>


<style scoped>
/* 单元格编辑样式 */
.cell-edit {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  padding: 8px 15px;
  background: white;
  z-index: 2;
}

.cell-edit :deep(.el-input__wrapper) {
  height: 100%;
  padding: 0 8px;
}

.cell-content {
  width: 100%;
  height: 100%;
  min-height: 28px;
  padding: 8px 15px;
  cursor: cell;
}
/* 表单项提示 */
.form-item-with-tip {
  position: relative;
}

.required-tip {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #ff4444;
  font-size: 12px;
}
/* 增加紧凑布局样式 */
.search-filters {
  :deep(.el-col) {
    margin-left: 8px !important;

    /* 减小列间距 */
    &:first-child {
      margin-left: 0 !important;
    }
  }

  .el-select,
  .el-input,
  .el-date-editor {
    width: 100%;
  }

  .el-date-editor.el-input__wrapper {
    width: 100%;
    padding: 0 10px;
  }
}

/* 金额异常行样式 */
:deep(.amount-warning-row) {
  background-color: #ffe0b2;

  &:hover>td {
    background-color: #fff3e0 !important;
  }

  &>.el-table__cell {
    background-color: #ffe0b2;
  }
}

/* 优化状态显示 */
.status-tag {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 12px;
  display: inline-block;
}

.completed {
  background: #e8f5e9;
  color: #2e7d32;
}

.uncompleted {
  background: #ffebee;
  color: #c62828;
}

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
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.pagination {
  margin-top: 20px;
  justify-content: flex-end;
}

.content {
  padding: 8px;
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

.table-card {
  margin-top: 8px;
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