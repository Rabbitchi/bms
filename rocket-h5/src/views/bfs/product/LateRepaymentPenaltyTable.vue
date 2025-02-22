<template>
  <div class="table_container">
    <h3 style="margin-top: 20px">Late Repayment Penalty table</h3>
    <div class="table_filter clearfix">
      <el-form :inline="true" :model="queryConditions.data" ref="rateTable">
        <el-row>
          <el-col :span="24">
            <el-form-item label="Late Repayment Penalty No.:" prop="lateFeeId">
              <el-input v-model="queryConditions.data.lateFeeId" />
            </el-form-item>
            <el-form-item label="Late Repayment Penalty name:" prop="name">
              <el-input v-model="queryConditions.data.name" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="bottom_operat">
        <el-button
          class="btn"
          icon="el-icon-plus"
          type="primary"
          @click="AddItem"
        >
          Add
        </el-button>
        <el-button
          class="btn"
          icon="el-icon-refresh-right"
          @click="refreshTable"
        >
          Update
        </el-button>
        <el-button
          class="btn btn-default fr"
          icon="el-icon-refresh"
          @click="resetForm"
        >
          Reset
        </el-button>
        <el-button
          class="btn fr"
          type="primary"
          icon="el-icon-search"
          @click="tableSearch"
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
        <el-table-column
          label="Late Repayment Penalty No."
          width="250"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.lateFeeId }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Name" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Creation time " align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.createTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Operator" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.createUser }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Modify time" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.updateTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Operator" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.updateUser }}</span>
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
    <!--新增、修改弹窗 start-->
    <el-dialog
      :title="
        dialogType == 'add' ? 'Add late money' : 'Modify Late Repayment Penalty'
      "
      :visible.sync="dialogFormVisible"
      :before-close="dialogClose"
      class="add-dialog"
    >
      <el-form
        :model="form.data"
        class="clearfix"
        :inline="true"
        ref="addForm"
        :rules="rules"
      >
        <el-form-item
          label="Late Repayment Penalty No.:"
          prop="lateFeeId"
          class="dialog_top_item"
        >
          <el-input
            v-model.number="form.data.lateFeeId"
            autocomplete="off"
            :disabled="dialogType === 'modify'"
            type="number"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="Late Repayment Penalty name:"
          prop="name"
          class="dialog_top_item"
        >
          <el-input
            v-model="form.data.name"
            autocomplete="off"
            :disabled="dialogType === 'modify'"
          ></el-input>
        </el-form-item>
        <div class="stagedPenalty">
          <h4>Staged Late Repayment Penalty:</h4>
          <el-button
            class="addBtn"
            @click="addFormItem"
            type="primary"
            icon="el-icon-plus"
            size="mini"
          >
            Add
          </el-button>
          <template v-if="form.data.lateFeeList.length">
            <div class="formListItem">
              <el-form-item>Maximal days of sublevel</el-form-item>
              <el-form-item>Charging ratio (0~1)</el-form-item>
              <el-form-item>Operation</el-form-item>
            </div>
            <div
              v-for="(item, index) in form.data.lateFeeList"
              :key="index"
              class="formListItem"
            >
              <el-form-item
                :prop="'lateFeeList.' + index + '.days'"
                :rules="{
                  required: true,
                  message: 'Cannot be empty',
                  trigger: 'blur'
                }"
              >
                <el-input v-model="item.days"></el-input>
              </el-form-item>
              <el-form-item
                :prop="'lateFeeList.' + index + '.rate'"
                :rules="{
                  required: true,
                  message: 'Cannot be empty',
                  trigger: 'blur'
                }"
              >
                <el-input v-model="item.rate"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button @click.prevent="removeFormItem(item)">
                  Delete
                </el-button>
              </el-form-item>
            </div>
          </template>
          <template v-else>
            <div class="formListItem">
              <el-form-item>Maximal days of sublevel</el-form-item>
              <el-form-item>Charging ratio (0~1)</el-form-item>
              <el-form-item>Operation</el-form-item>
            </div>
          </template>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          @click="
            dialogType === 'add' ? addConfirm('addForm') : mdfConfirm('addForm')
          "
        >
          Confirm
        </el-button>
        <el-button class="cancle" @click="dialogFormVisible = false">
          Cancel
        </el-button>
      </div>
    </el-dialog>
    <!--新增、修改弹窗 end-->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Pagination from '@/components/Pagination'
import {
  pageListLateFee,
  addLateFee,
  deleteLateFee,
  modifyLateFee,
  lateFeeLoad
} from '@/api/bfs/lateRepaymentPenalty'

export default {
  name: 'BfsLateRepaymentPenaltyTable',
  components: { Pagination },
  data() {
    return {
      listLoading: false,
      dialogFormVisible: false,
      total: 0,
      tableData: [],
      queryConditions: {
        data: {
          name: '',
          lateFeeId: ''
        },
        page: {
          pageNum: 1,
          pageSize: 10
        }
      },
      //表单校验规则
      rules: {
        name: [
          { required: true, message: 'please enter', trigger: 'blur' },
          { min: 1, message: 'Can not be empty', trigger: 'blur' }
        ],
        lateFeeId: [
          {
            required: true,
            type: 'number',
            message: 'please enter',
            trigger: 'blur'
          }
        ]
      },
      form: {
        data: {
          lateFeeId: null,
          name: '',
          lateFeeList: []
        }
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
    dialogClose() {
      this.dialogFormVisible = false
      if (this.$refs['addForm']) {
        this.$refs['addForm'].resetFields()
      }
    },
    AddItem: function () {
      this.dialogType = 'add'
      this.form = this.$options.data().form
      if (this.$refs['addForm']) {
        this.$refs['addForm'].resetFields()
      }
      this.dialogFormVisible = true
    },
    modifyRow: function (row) {
      let _this = this
      let data = { data: { lateFeeId: row.lateFeeId } }
      lateFeeLoad(data)
        .then((res) => {
          let newData = JSON.parse(JSON.stringify(row))
          _this.form.data.name = newData.name
          _this.form.data.lateFeeId = newData.lateFeeId
          _this.form.data.lateFeeList = res.data.lateFeeList
          _this.dialogType = 'modify'
          _this.dialogFormVisible = true
        })
        .catch((e) => {
          console.log('error')
        })
    },
    deleteRow: function (row) {
      let _this = this
      let data = {
        data: {
          lateFeeId: row.lateFeeId
        }
      }
      _this
        .$confirm(
          'Confirm deletion of Late Repayment Penalty information?',
          'System prompt',
          {
            confirmButtonText: 'Comfirm',
            cancelButtonText: 'Close',
            type: 'warning'
          }
        )
        .then(() => {
          deleteLateFee(data)
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
      pageListLateFee(_this.queryConditions)
        .then((res) => {
          _this.listLoading = false
          if (res.data) {
            _this.setTableData(res)
          } else {
            _this.tableData = []
            _this.total = 0
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
    addFormItem() {
      this.form.data.lateFeeList.push({
        days: null,
        rate: ''
      })
    },
    removeFormItem(item) {
      var index = this.form.data.lateFeeList.indexOf(item)
      if (index !== -1) {
        this.form.data.lateFeeList.splice(index, 1)
      }
    },
    refreshTable() {
      this.queryConditions.page.pageNum = 1
      this.getListItem()
    },
    //确认添加
    addConfirm(formName) {
      let _this = this
      _this.$refs[formName].validate((valid) => {
        if (valid) {
          addLateFee(_this.form)
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
    //确认修改
    mdfConfirm(formName) {
      let _this = this
      _this.$refs[formName].validate((valid) => {
        if (valid) {
          modifyLateFee(_this.form)
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
    }
  }
}
</script>

<style scoped lang="scss">
.stagedPenalty {
  margin: 10px 0;
  display: table;
  border-collapse: collapse;
  width: 100%;
  padding: 10px 0;
  border-spacing: 5px 1px;
  h4 {
    font-weight: 700;
    color: #000;
    margin-bottom: 10px;
    display: block;
  }
  .addBtn {
    margin-bottom: 10px;
  }
  .formListItem {
    display: table-row;
    line-height: 40px;
    div {
      display: table-cell;
      &.el-form-item {
        border: 1px solid #ccc;
        /deep/ .el-input__inner {
          margin: 0;
          height: 34px;
        }
        /deep/ .el-form-item__content {
          padding-left: 10px;
          button {
            border: none;
            margin-left: -10px;
          }
        }
      }
    }
  }
}
</style>
