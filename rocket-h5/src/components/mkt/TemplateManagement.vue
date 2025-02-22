/* * @Author: xiang.liu * @Date: 2019-12-11 17:35:56 * @Last Modified by:
xiang.liu * @Last Modified time: 2021-06-15 14:05:46 */

<template>
  <div class="table_container">
    <h2>{{ templateType }} 模板管理</h2>
    <div class="table_filter clearfix">
      <el-form
        ref="TemplateManagement"
        :model="queryConditions.data"
        label-position="left"
        label-width="100px"
        class="tableQueryForm"
      >
        <el-row :gutter="24">
          <el-col :span="8" :xs="24">
            <el-form-item label="模板名称:" prop="name">
              <el-input
                placeholder="模板名称"
                v-model="queryConditions.data.name"
              />
            </el-form-item>
          </el-col>

          <el-col :span="8" :xs="24">
            <el-form-item label="业务线:" prop="product">
              <el-select
                v-model="queryConditions.data.product"
                placeholder="业务线"
                multiple
                filterable
              >
                <el-option
                  v-for="(item, index) in productList"
                  :key="index"
                  :label="item"
                  :value="item"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8" :xs="24">
            <el-form-item label="操作人:" prop="updateBy">
              <el-input
                placeholder="操作人"
                v-model="queryConditions.data.updateBy"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :span="24">
          <el-form-item class="btn_wrapper" label-width="0">
            <el-col :span="8">
              <el-button
                size="medium"
                class="btn btn-default"
                @click="editCategory"
              >
                分类管理
              </el-button>
              <el-button
                size="medium"
                class="btn"
                type="primary"
                @click="templateDisplay(true, 'create')"
              >
                创建模板
              </el-button>
            </el-col>

            <el-col :offset="12" :span="4">
              <el-button-group>
                <el-button
                  size="medium"
                  class="btn btn-default"
                  @click="resetForm"
                >
                  重置
                </el-button>
                <el-button
                  size="medium"
                  class="btn"
                  type="primary"
                  icon="el-icon-search"
                  @click="tableSearch"
                >
                  查询
                </el-button>
              </el-button-group>
            </el-col>
          </el-form-item>
        </el-row>
      </el-form>
    </div>
    <el-divider />

    <el-table
      ref="table"
      v-loading="listLoading"
      class="table"
      :data="tableData"
      :fit="true"
      border
      stripe
      element-loading-text="加载中..."
      empty-text="暂无数据"
    >
      <el-table-column
        show-overflow-tooltip
        sortable
        prop="categoryName"
        label="模板分类"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.categoryName }}</span>
        </template>
      </el-table-column>

      <el-table-column
        show-overflow-tooltip
        sortable
        prop="name"
        label="模板名称"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>

      <!-- <el-table-column show-overflow-tooltip sortable prop="id" label="模板ID">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column> -->

      <el-table-column
        v-if="templateType === 'IVR'"
        show-overflow-tooltip
        sortable
        prop="taskId"
        label="任务 ID"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.taskId }}</span>
        </template>
      </el-table-column>

      <!-- <el-table-column show-overflow-tooltip sortable prop="id" label="模板 ID">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column> -->

      <el-table-column
        show-overflow-tooltip
        sortable
        prop="product"
        label="业务线"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.product }}</span>
        </template>
      </el-table-column>

      <el-table-column
        show-overflow-tooltip
        sortable
        prop="updateTime"
        label="模板修改时间"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.updateTime }}</span>
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        sortable
        prop="updateBy"
        label="操作人"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.updateBy }}</span>
        </template>
      </el-table-column>

      <!-- <el-table-column label="操作" fixed="right" width="60px">
        <template slot-scope="scope">
          <el-button
            class="btn btn-default"
            type="text"
            @click="editTemplate(scope.row.id)"
          >编辑</el-button>
        </template>
      </el-table-column> -->

      <el-table-column label="操作" fixed="right" width="144px">
        <template slot-scope="scope">
          <el-button
            class="btn btn-default"
            type="text"
            @click="editTemplate(scope.row)"
          >
            编辑
          </el-button>
          <el-button
            class="btn btn-default"
            type="text"
            @click="deleteTemplate(scope.row.id)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryConditions.page.pageNum"
      :limit.sync="queryConditions.page.pageSize"
      @pagination="getListItem()"
    />
    <CategoryManagement
      :categoryType="templateType"
      :showDialog.sync="showDialog"
    />
    <createAppPushDialog
      @cancelDailog="templateDisplay(false)"
      :dialogShow="createAppPushDialogShow"
      @createdSuccess="getListItem"
      :actionType="actionType"
      :actionID="currentActionID"
    />
    <createSMSDialog
      @cancelDailog="templateDisplay(false)"
      :dialogShow="createSMSDialogShow"
      @createdSuccess="getListItem"
      :actionType="actionType"
      :actionID="currentActionID"
      :templateCode="templateCode"
    />
    <createIVRDialog
      @cancelDailog="templateDisplay(false)"
      :dialogShow="createIVRDialogShow"
      @createdSuccess="getListItem"
      :actionType="actionType"
      :actionID="currentActionID"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Pagination from '@/components/Pagination'
// import { queryTemplateList, updateTemplate } from "@/api/mkt/template.js";
import {
  querySMSTemplateList,
  queryIVRTemplateList,
  queryAppTemplateList,
  // editSMSTemplate,
  // editIVRTemplate,
  // editAppTemplate,
  deleteSMSTemplate,
  deleteIVRTemplate,
  deleteAppTemplate
} from '@/api/mkt/template.js'
import permission from '@/directive/permission/index.js' // 权限判断指令
import CategoryManagement from '@/components/mkt/CategoryManagement'
import CreateAppPushDialog from '@/components/mkt/TemplateDialog/createAppPushDialog'
import CreateSMSDialog from '@/components/mkt/TemplateDialog/createSMSDialog'
import CreateIVRDialog from '@/components/mkt/TemplateDialog/createIVRDialog'
import { getProduct } from '@/api/mkt/stragety.js'

if (process.env.NODE_ENV === 'development') {
  require('@/mock/template.js')
}

export default {
  name: 'TemplateManagement',
  components: {
    Pagination,
    CategoryManagement,
    CreateAppPushDialog,
    CreateSMSDialog,
    CreateIVRDialog
  },
  directives: { permission },
  props: {
    templateType: {
      type: String,
      default: 'SMS'
    }
  },
  data() {
    return {
      productList: [],
      showDialog: false,
      actionType: 'create',
      currentActionID: '',
      createAppPushDialogShow: false,
      createSMSDialogShow: false,
      createIVRDialogShow: false,
      templateCode: '',
      listLoading: false,
      loading: false,
      total: 0,
      tableData: [],
      queryConditions: {
        page: {
          pageNum: 1,
          pageSize: 10,
          totalRecord: 0
        },
        data: {
          product: [],
          updateBy: '',
          name: ''
        }
      }
    }
  },
  computed: {
    ...mapGetters(['sidebar'])
  },
  watch: {},
  mounted() {
    this.getListItem()
    // this.productList = [
    //   "PalmCredit",
    //   "EasyBuy",
    //   "NewCredit",
    //   "Xcrosscash",
    //   "Xcash",
    //   "PC-XCross",
    //   "EB-XCross"
    // ]
    this.getProduct()
  },
  methods: {
    // 获取业务线枚举
    getProduct() {
      let arr = JSON.parse(sessionStorage.getItem('omsProList'))
      if (arr && arr.length > 0) {
        this.productList = arr
      } else {
        getProduct().then((res) => {
          this.productList = res.data
          sessionStorage.setItem('omsProList', JSON.stringify(this.productList))
          // JSON.parse(sessionStorage.getItem('omsProList'))
        })
      }
    },
    toReviewInfoPage: function (row) {
      if (row.uwStatus === 'Rejected' || row.uwStatus === 'Approved') {
        this.$router.push({
          path: '/WorkOrderReview/ReviewInfo',
          query: { orderId: row.creditApplyNo }
        })
      } else {
        this.$message({
          type: 'info',
          message: 'No Review Information.'
        })
      }
    },
    editTemplate: function (row) {
      this.templateDisplay(true, 'modify')
      this.currentActionID = row.id
      this.templateCode = row.templateCode
      // let _this = this;
      // let data = this.queryConditions;
      // let func = {
      //   SMS: querySMSTemplateList,
      //   IVR: queryIVRTemplateList,
      //   APP: queryAppTemplateList
      // };
      // _this.listLoading = true;
      // this.templateType &&
      //   func[this.templateType](data)
      //     .then((res) => {
      //       _this.listLoading = false;
      //       if (res.data) {
      //         this.setTableData(res);
      //       }
      //     })
      //     .catch((e) => {
      //       _this.listLoading = false;
      //     });
    },
    deleteTemplate: function (id) {
      let _this = this
      let func = {
        SMS: deleteSMSTemplate,
        IVR: deleteIVRTemplate,
        APP: deleteAppTemplate
      }

      this.$confirm(`此操作将永久删除该模板`, '删除模板', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          _this.listLoading = true
          func[_this.templateType]({ data: id })
            .then((res) => {
              _this.listLoading = false
              this.$message({
                type: 'success',
                message: '模板删除成功, 更新数据中'
              })
              _this.getListItem()
            })
            .catch((e) => {
              console.log(e)
              _this.listLoading = false
            })
        })
        .catch(() => {
          console.log('catch')
          this.$message({
            type: 'info',
            message: '取消模板删除'
          })
        })
    },
    getListItem: function () {
      let _this = this
      let data = this.queryConditions
      let func = {
        SMS: querySMSTemplateList,
        IVR: queryIVRTemplateList,
        APP: queryAppTemplateList
      }
      _this.listLoading = true
      this.templateType &&
        func[this.templateType](data)
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
    // changeTemplateStatus: function (id, status) {
    //   let _this = this;
    //   let data = {
    //     data: {
    //       id: id,
    //       status: status
    //     }
    //   };
    //   updateTemplate(data)
    //     .then((res) => {
    //       if (res.data) {
    //         _this.$message({
    //           type: "success",
    //           message: `修改状态为 ${status} 成功, 页面更新中`
    //         });
    //       }
    //     })
    //     .catch((e) => {})
    //     .finally((e) => {
    //       _this.getListItem(_this.queryConditions);
    //     });
    // },
    setTableData: async function (data) {
      this.tableData = data.data
      this.total = data.page.totalRecord
      await this.$nextTick()
    },
    resetForm: function () {
      this.$refs['TemplateManagement'].resetFields()
    },
    editCategory: function () {
      this.showDialog = true
    },
    templateDisplay: function (show, type) {
      if (type) {
        this.actionType = type
      }
      switch (this.templateType) {
        case 'SMS':
          this.createSMSDialogShow = show
          break
        case 'APP':
          this.createAppPushDialogShow = show
          break
        case 'IVR':
          this.createIVRDialogShow = show
          break
      }
    },
    tableSearch: function () {
      this.queryConditions.page.pageNum = 1
      this.$refs['TemplateManagement'].validate((valid) => {
        if (valid) {
          this.getListItem(this.queryConditions)
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.el-table {
  overflow-y: scroll;
}
.table_container {
  background: #ffffff;
  padding: 2vw;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.11);
  border-radius: 8px;
  font-size: 14px;
  h2 {
    margin-bottom: 1.5vw;
    margin-top: 0;
    text-align: left;
    border-left: 5px solid #409eff;
    padding-left: 10px;
  }
  .table_list {
    margin-top: 1vw;
  }
  .tableQueryForm {
    text-align: left;
    overflow: hidden;
    /deep/ .el-form-item__label {
      text-align: left;
    }
    .el-form-item {
      margin-bottom: 1vw;
      /deep/ .el-input {
        width: 100%;
      }
      /deep/ .el-form-item__label {
        word-break: normal;
      }
      &.btn_wrapper {
        margin-right: 0;
      }
      .el-date-editor--daterange.el-input__inner {
        width: 100%;
      }
      .el-button--mini {
        padding: 7px 7px;
      }
    }
    .el-select {
      width: 100%;
    }
  }
  .btn-wrapper {
    .el-button {
      margin: 5px;
    }
  }
  .el-button {
    font-size: 14px;
  }
}

.el-divider {
  margin: 0 0 1vw 0;
}

::v-deep th,
::v-deep td {
  padding: 6px 0;
}
</style>
