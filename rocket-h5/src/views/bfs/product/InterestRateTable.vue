<!--
	作者：offline
	时间：2020-08-06
	描述：Interest rate table
-->
<template>
  <div class="table_container">
    <h3>Interest rate table</h3>
    <div class="table_filter clearfix">
      <el-form
        ref="rateTable"
        :inline="true"
        :model="queryConditions.data"
        label-position="left"
      >
        <el-form-item label="Name of interest rate:" prop="name">
          <el-input
            v-model="queryConditions.data.name"
            autocomplete="off"
            placeholder
          ></el-input>
        </el-form-item>
      </el-form>
      <div class="btn_wrapper" label-width="0">
        <el-button class="btn" type="primary" @click="AddItem">+ Add</el-button>
        <el-button
          class="btn"
          icon="el-icon-refresh-right"
          @click="refreshTable"
        >
          Update
        </el-button>
        <el-button
          class="btn btn-default fr"
          @click="resetForm"
          icon="el-icon-refresh"
        >
          Reset
        </el-button>
        <el-button
          class="btn fr"
          type="primary"
          @click="tableSearch"
          icon="el-icon-search"
        >
          Query
        </el-button>
      </div>
    </div>

    <el-divider></el-divider>

    <div class="table_list">
      <el-table
        ref="table"
        class="table"
        v-loading="listLoading"
        :data="tableData"
        border
        stripe
        empty-text="No data under current query"
      >
        <el-table-column label="No." width="150" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.interestRateId }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Name" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Interest rate type" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.rateType }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Interest rate" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.interestRate }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Interest accrual benchmark year" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.baseYear }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="Interest accrual benchmark month"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.baseMonth }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Creation time" width="180" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.createTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Operator" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.createUser }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Operation" width="250" align="center">
          <template slot-scope="scope">
            <el-button
              class="btn btn-default"
              size="mini"
              icon="el-icon-delete"
              type="danger"
              @click="deleteRow(scope.row)"
            >
              Delete
            </el-button>
            <el-button
              class="btn btn-default"
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="modifyRow(scope.row)"
            >
              Modify
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
    </div>
    <!--新增 、修改弹窗start-->
    <el-dialog
      :title="
        dialogType == 'add' ? 'Add interest rate' : 'Modify interest rate'
      "
      :visible.sync="dialogFormVisible"
      :before-close="dialogClose"
      custom-class="dialog_form_wrap"
    >
      <el-form
        :model="form"
        :rules="rules"
        ref="formDom"
        class="clearfix"
        label-width="160px"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="Name of interest rate :" prop="name">
              <el-input v-model="form.name" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Interest rate type:" prop="rateType">
              <el-select v-model="form.rateType" placeholder>
                <el-option label="year Rate" value="Y"></el-option>
                <el-option label="month Rate" value="M"></el-option>
                <el-option label="day Rate" value="D"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="Interest rate:" prop="interestRate">
              <el-input
                v-model="form.interestRate"
                autocomplete="off"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="Interest accrual benchmark year:"
              prop="baseYear"
            >
              <el-select v-model="form.baseYear" placeholder>
                <el-option label="360 day/year" value="360"></el-option>
                <el-option label="365 day/year" value="365"></el-option>
                <el-option label="366 day/year" value="366"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item
              label="Interest accrual benchmark month:"
              prop="baseMonth"
            >
              <el-select v-model="form.baseMonth" placeholder>
                <el-option label="30 days/month" value="30"></el-option>
                <el-option label="31 days/month" value="31"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          @click="
            dialogType === 'add' ? addConfirm('formDom') : mdfConfirm('formDom')
          "
        >
          Confirm
        </el-button>
      </div>
    </el-dialog>
    <!--新增、修改弹窗  end-->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Pagination from '@/components/Pagination'
import {
  pageListInterest,
  addInterest,
  deleteInterest,
  modifyInterest
} from '@/api/bfs/interestAndPenalty'

export default {
  name: 'BfsInterestRateTable',
  components: { Pagination },
  data() {
    return {
      listLoading: false,
      dialogFormVisible: false,
      total: 0,
      tableData: [],
      queryConditions: {
        data: {
          name: ''
        },
        page: {
          pageNum: 1,
          pageSize: 10
        }
      },
      form: {
        name: '',
        rateType: '',
        interestRate: null,
        baseYear: null,
        baseMonth: null
      },
      //表单校验规则
      rules: {
        name: [
          { required: true, message: 'please enter', trigger: 'blur' },
          { min: 1, message: 'Can not be empty', trigger: 'blur' }
        ],
        rateType: [
          { required: true, message: 'please select', trigger: 'change' }
        ],
        interestRate: [
          { required: true, message: 'please enter', trigger: 'blur' },
          { min: 1, message: 'Can not be empty', trigger: 'blur' }
        ],
        baseYear: [
          { required: true, message: 'please select', trigger: 'change' }
        ],
        baseMonth: [
          { required: true, message: 'please select', trigger: 'change' }
        ]
      },
      //判断弹窗是新增，还是修改
      dialogType: 'add'
    }
  },
  computed: {
    ...mapGetters(['sidebar'])
  },
  mounted() {
    this.getListItem()
  },
  methods: {
    AddItem: function () {
      this.dialogType = 'add'
      this.form = this.$options.data().form
      if (this.$refs['formDom']) {
        this.$refs['formDom'].resetFields()
      }
      this.dialogFormVisible = true
    },
    dialogClose() {
      this.dialogFormVisible = false
      if (this.$refs['formDom']) {
        this.$refs['formDom'].resetFields()
      }
    },
    modifyRow: function (row) {
      let newData = JSON.parse(JSON.stringify(row))
      //将interestRate字段处理成字符串
      newData.interestRate = newData.interestRate.toString()
      this.form = newData
      this.dialogType = 'modify'
      this.dialogFormVisible = true
    },
    deleteRow: function (row) {
      let _this = this
      let data = {
        data: {
          interestRateId: row.interestRateId
        }
      }
      _this
        .$confirm(
          'Confirm deletion of interest rate information?',
          'System prompt',
          {
            confirmButtonText: 'Comfirm',
            cancelButtonText: 'Close',
            type: 'warning'
          }
        )
        .then(() => {
          deleteInterest(data)
            .then((res) => {
              _this.$message({
                type: 'success',
                message: 'successfully deleted!'
              })
              //删除成功，刷新当前列表
              _this.getListItem()
            })
            .catch((e) => {
              console.log('error')
            })
        })
        .catch(() => {
          _this.$message({
            type: 'info',
            message: 'Canceled'
          })
        })
    },
    getListItem: function () {
      let _this = this
      _this.listLoading = true
      // 分页逻辑
      pageListInterest(_this.queryConditions)
        .then((res) => {
          _this.listLoading = false
          if (res.data) {
            _this.setTableData(res)
          } else {
            this.tableData = []
            this.total = 0
          }
        })
        .catch((e) => {
          _this.listLoading = false
        })
    },
    setTableData: async function (data) {
      this.tableData = data.data
      this.total = data.page.totalRecord
      await this.$nextTick()
      this.$refs.table.bodyWrapper.scrollTop = 0
    },
    resetForm: function () {
      this.$refs['rateTable'].resetFields()
      this.getListItem()
    },
    tableSearch() {
      this.queryConditions.page.pageNum = 1
      this.getListItem()
    },
    //刷新
    refreshTable() {
      this.queryConditions.page.pageNum = 1
      this.getListItem()
    },
    //添加确定
    addConfirm(formName) {
      let _this = this
      _this.$refs[formName].validate((valid) => {
        if (valid) {
          //处理interestRate类型
          _this.form.interestRate = Number(_this.form.interestRate)
          let data = {
            data: _this.form
          }
          addInterest(data)
            .then((res) => {
              _this.dialogFormVisible = false
              _this.queryConditions.page.pageNum = 1
              _this.getListItem()
            })
            .catch((e) => {
              _this.dialogFormVisible = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    //修改确认
    mdfConfirm(formName) {
      let _this = this
      _this.$refs[formName].validate((valid) => {
        if (valid) {
          //处理interestRate类型
          _this.form.interestRate = Number(_this.form.interestRate)
          let data = {
            data: _this.form
          }
          modifyInterest(data)
            .then((res) => {
              _this.dialogFormVisible = false
              _this.getListItem()
            })
            .catch((e) => {
              _this.dialogFormVisible = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
/deep/ .el-table .btn-mdf {
  background-color: #23c6c8;
  border-color: #23c6c8;
  color: #ffffff;
}
.table_filter .btn_wrapper {
  margin-bottom: 0;
}
/deep/ .el-dialog__body {
  padding-bottom: 0;
}
/deep/ .el-dialog__footer {
  position: relative;
  right: 0;
}
/deep/ .el-dialog {
  border-radius: 5px;
}
</style>
