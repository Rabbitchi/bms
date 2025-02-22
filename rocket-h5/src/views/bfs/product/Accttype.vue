<!--
	作者：offline
	时间：2020-07-30
	描述：Interest rate table
-->
<template>
  <div class="table_container">
    <h3>Accttype</h3>
    <div class="table_filter clearfix">
      <el-form
        ref="rateTable"
        :inline="true"
        :model="queryConditions.data"
        label-position="left"
      >
        <el-form-item label="acctType:" prop="acctType">
          <el-input
            v-model="queryConditions.data.acctType"
            class="queryForm_input"
          />
        </el-form-item>
        <el-form-item label="acctTypeName:" prop="acctTypeName">
          <el-input
            v-model="queryConditions.data.acctTypeName"
            class="queryForm_input"
          />
        </el-form-item>
      </el-form>
      <div class="btn_wrapper" label-width="0">
        <el-button class="btn" type="primary" @click="AddItem">+ Add</el-button>
        <el-button
          class="btn"
          @click="refreshTable"
          icon="el-icon-refresh-right"
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
        <el-table-column label="acctLvl" width="150" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.acctLvl }}</span>
          </template>
        </el-table-column>
        <el-table-column label="acctType" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.acctType }}</span>
          </template>
        </el-table-column>
        <el-table-column label="acctTypeName" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.acctTypeName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="graceDays" width="180" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.graceDays }}</span>
          </template>
        </el-table-column>
        <el-table-column label="loanSpan" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.loanSpan }}</span>
          </template>
        </el-table-column>
        <el-table-column label="loanSpanCount" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.loanSpanCount }}</span>
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
      :title="dialogType == 'add' ? 'Add Accttype' : 'Modify Accttype'"
      :visible.sync="dialogFormVisible"
      class="dialog_form_wrap"
      :before-close="dialogClose"
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
            <el-form-item label="acctLvl" prop="acctLvl">
              <el-input v-model="form.acctLvl" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="acctType" prop="acctType">
              <el-input v-model="form.acctType" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="acctTypeName" prop="acctTypeName">
              <el-input
                v-model="form.acctTypeName"
                autocomplete="off"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="graceDays" prop="graceDays">
              <el-input v-model="form.graceDays" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="loanSpan" prop="loanSpan">
              <el-select v-model="form.loanSpan" placeholder>
                <el-option label="Y" value="Y"></el-option>
                <el-option label="M" value="M"></el-option>
                <el-option label="D" value="D"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="loanSpanCount" prop="loanSpanCount">
              <el-input
                v-model="form.loanSpanCount"
                autocomplete="off"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addConfirm('formDom')">
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
import { acctTypeQueryAllList, acctTypeSave } from '@/api/bfs/acctType'

export default {
  name: 'BfsAccttype',
  components: { Pagination },
  data() {
    return {
      listLoading: false,
      dialogFormVisible: false,
      total: 0,
      tableData: [],
      queryConditions: {
        page: {
          pageNum: 1,
          pageSize: 10,
          startIndex: 0,
          totalPage: 0,
          totalRecord: 0
        },
        data: {
          acctType: '',
          acctTypeName: ''
        }
      },
      form: {
        acctLvl: '',
        acctType: '',
        acctTypeName: '',
        graceDays: '',
        loanSpan: '',
        loanSpanCount: ''
      },
      //表单校验规则
      rules: {
        acctLvl: [
          { required: true, message: 'please input', trigger: 'change' }
        ],
        acctType: [
          { required: true, message: 'please input', trigger: 'change' }
        ],
        acctTypeName: [
          { required: true, message: 'please input', trigger: 'change' }
        ],
        graceDays: [
          { required: true, message: 'please input', trigger: 'change' }
        ],
        loanSpan: [
          { required: true, message: 'please select', trigger: 'change' }
        ],
        loanSpanCount: [
          { required: true, message: 'please input', trigger: 'change' }
        ],
        channel: [
          { required: true, message: 'please input', trigger: 'change' }
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
    getListItem: function () {
      let _this = this
      _this.listLoading = true
      // 分页逻辑
      acctTypeQueryAllList(_this.queryConditions)
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
    setTableData: async function (data) {
      this.tableData = data.data
      this.total = data.page.totalRecord
      await this.$nextTick()
      this.$refs.table.bodyWrapper.scrollTop = 0
    },
    resetForm: function () {
      this.$refs['rateTable'].resetFields()
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
          let data = {
            data: _this.form
          }
          acctTypeSave(data)
            .then((res) => {
              _this.$message({
                message: 'success',
                type: 'success'
              })
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
