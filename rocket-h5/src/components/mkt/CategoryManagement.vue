/* * @Author: xiang.liu * @Date: 2021-06-04 14:45:15 * @Last Modified by:
xiang.liu * @Last Modified time: 2021-06-15 14:47:30 * @Location: 包含在
TemplateManagement 中 */

<template>
  <el-dialog
    :title="`${categoryType} 分类管理`"
    :visible.sync="showDialog"
    @open="queryData"
    @close="closeDialog"
    :close-on-click-modal="false"
    width="600px"
    top="100px"
  >
    <div class="riskInformation">
      <el-form
        ref="CategoryManagementForm"
        :model="queryConditions.data"
        label-position="left"
        label-width="100px"
      >
        <el-row :gutter="20">
          <el-col :span="16" :xs="24">
            <el-form-item label="分类名称:" prop="name">
              <el-input
                placeholder="输入以筛选"
                v-model="queryConditions.data.name"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :offset="2" :span="4" :xs="24">
            <!-- <el-button class="btn btn-default" @click="resetForm">筛选</el-button> -->
            <el-button class="btn" type="primary" @click="createCategory">
              创建分类
            </el-button>
          </el-col>
        </el-row>
      </el-form>

      <el-table
        ref="table"
        v-loading="listLoading"
        class="categoryTable"
        :data="tableData.filter(tableFilter)"
        :fit="true"
        border
        empty-text
      >
        <el-table-column
          show-overflow-tooltip
          sortable
          prop="name"
          label="分类名称"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right">
          <template slot-scope="scope">
            <el-button
              class="btn btn-default"
              type="text"
              @click="modifyCategory(scope.row)"
            >
              编辑
            </el-button>
            <el-button
              class="btn btn-default"
              type="text"
              @click="deleteCategory(scope.row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="btn_wrapper">
      <el-button type="primary" class="closeBtn" @click="closeDialog">
        Close
      </el-button>
    </div>
  </el-dialog>
</template>
<script>
import { mapGetters } from 'vuex'
import {
  querySMSCategoryList,
  queryIVRCategoryList,
  queryAppCategoryList,
  addSMSCategory,
  addIVRCategory,
  addAppCategory,
  editSMSCategory,
  editIVRCategory,
  editAppCategory,
  deleteSMSCategory,
  deleteIVRCategory,
  deleteAppCategory
} from '@/api/mkt/template.js'

// if (process.env.NODE_ENV === "development") {
//   require("@/mock/laf-bg.js");
// }

export default {
  name: 'CategoryManagementR',
  components: {},
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    orderId: {
      type: String,
      default: ''
    },
    categoryType: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      listLoading: false,
      loading: false,
      total: 0,
      tableData: [],
      queryConditions: {
        data: {
          name: ''
        }
      }
    }
  },
  computed: {
    ...mapGetters(['sidebar'])
  },
  mounted() {
    //this.queryData();
  },
  methods: {
    tableFilter(element) {
      return (
        !this.queryConditions.data.name ||
        (element.name &&
          element.name.indexOf(this.queryConditions.data.name) > -1)
      )
      //return data => !search || data.name.toLowerCase().includes(search.toLowerCase())
    },
    closeDialog() {
      this.$emit('update:showDialog', false)
    },
    queryData: function () {
      this.getListItem(this.queryConditions)
    },
    modifyCategory: function (row) {
      let _this = this
      let func = {
        SMS: editSMSCategory,
        IVR: editIVRCategory,
        APP: editAppCategory
      }
      this.$prompt(`请输入 ${this.categoryType} 修改后的分类名称`, '修改分类', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputErrorMessage: '请输入分类名称',
        inputValidator: (value) => {
          if (!value || value.trim().length < 1) {
            return '输入不能为空'
          }
        }
      })
        .then(({ value }) => {
          _this.listLoading = true
          func[_this.categoryType]({ data: { id: row.id, name: value } })
            .then((res) => {
              _this.listLoading = false
              this.$message({
                type: 'success',
                message: '分类修改成功, 刷新数据中'
              })
              _this.queryData()
            })
            .catch((e) => {
              _this.listLoading = false
            })
        })
        .catch(() => {
          console.log('catch')
          this.$message({
            type: 'info',
            message: '取消分类修改'
          })
        })
    },
    deleteCategory: function (row) {
      let _this = this
      let func = {
        SMS: deleteSMSCategory,
        IVR: deleteIVRCategory,
        APP: deleteAppCategory
      }

      this.$confirm(`此操作将永久删除该分类`, '删除分类', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          _this.listLoading = true
          func[_this.categoryType]({ data: row.id })
            .then((res) => {
              _this.listLoading = false
              this.$message({
                type: 'success',
                message: '分类删除成功, 更新数据中'
              })
              _this.queryData()
            })
            .catch((e) => {
              _this.listLoading = false
            })
        })
        .catch(() => {
          console.log('catch')
          this.$message({
            type: 'info',
            message: '取消分类删除'
          })
        })
    },
    createCategory: function () {
      let _this = this
      let func = {
        SMS: addSMSCategory,
        IVR: addIVRCategory,
        APP: addAppCategory
      }
      this.$prompt(`请输入 ${this.categoryType} 分类名称`, '创建分类', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputErrorMessage: '请输入分类名称',
        inputValidator: (value) => {
          if (!value || value.trim().length < 1) {
            return '输入不能为空'
          }
        }
      })
        .then(({ value }) => {
          _this.listLoading = true
          func[_this.categoryType]({ data: { name: value } })
            .then((res) => {
              _this.listLoading = false
              this.$message({
                type: 'success',
                message: '分类创建成功'
              })
              _this.queryData()
            })
            .catch((e) => {
              _this.listLoading = false
            })
        })
        .catch(() => {
          console.log('catch')
          this.$message({
            type: 'info',
            message: '取消分类创建'
          })
        })
    },
    resetForm: function () {
      this.$refs['CategoryManagementForm'].resetFields()
    },
    getListItem: function () {
      let _this = this
      let data = {}
      let func = {
        //todo
        SMS: querySMSCategoryList,
        IVR: queryIVRCategoryList,
        APP: queryAppCategoryList
      }
      _this.listLoading = true
      this.categoryType &&
        func[this.categoryType](data)
          .then((res) => {
            _this.listLoading = false
            if (res.data) {
              this.setTableData(res)
            }
          })
          .catch((e) => {
            _this.listLoading = false
          })
    },
    setTableData: function (res) {
      this.tableData = res.data
      this.total = res.page.totalRecord
    }
  }
}
</script>

<style scoped lang="scss">
.categoryTable {
  margin-top: 20px;
}
.btn_wrapper {
  text-align: right;
  padding: 10px 0;
}

::v-deep .el-form-item {
  margin: 0;
}
::v-deep th,
::v-deep td {
  padding: 6px 0;
  button {
    padding: 4px 0;
  }
}
</style>
