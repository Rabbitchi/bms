<!--
	作者：ganshengqu
	时间：2020-08-19
	描述：Parameter list  菜单
-->
<template>
  <div class="table_container">
    <h3>Contact management</h3>
    <div class="table_filter clearfix">
      <el-form
        ref="rateTable"
        :inline="true"
        :model="queryConditions.data"
        label-position="left"
        class="queryForm"
      >
        <el-form-item label="Contract code：" prop="contractCode">
          <el-input
            v-model="queryConditions.data.contractCode"
            autocomplete="off"
            placeholder
            class="queryForm_input"
          ></el-input>
        </el-form-item>
        <el-form-item label="Contract name：" prop="contractName">
          <el-input
            v-model="queryConditions.data.contractName"
            autocomplete="off"
            placeholder
            class="queryForm_input"
          ></el-input>
        </el-form-item>
      </el-form>
      <div>
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
        <el-table-column label="Contract code" width="150" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.contractCode }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Contract type" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.contractType }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Contract name" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.contractName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Contract description" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.contractDesc }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Related channel" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.contractBizCodes }}</span>
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
              @click="modifyRow(scope.row)"
            >
              Update
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
    <!--新增-->
    <el-dialog
      :title="dialogType == 'add' ? 'Add contract' : 'Modify contract'"
      :visible.sync="dialogFormVisible"
      custom-class="dialog_form_wrap"
      :before-close="dialogClose"
      width="60%"
    >
      <el-form
        :model="form"
        ref="formDom"
        :rules="rules"
        class="clearfix"
        label-width="160px"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="Contract code:" prop="contractCode">
              <el-input
                v-model="form.contractCode"
                autocomplete="off"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Contract type :" prop="contractType">
              <el-input
                v-model="form.contractType"
                autocomplete="off"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="Contract name:" prop="contractName">
              <el-input
                v-model="form.contractName"
                autocomplete="off"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Contract description:" prop="contractDesc">
              <el-input
                v-model="form.contractDesc"
                autocomplete="off"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="Contract content:" required="true">
              <TinymceEditor
                @getContent="getContent"
                :parentContent="form.contractContent"
                :clearContent="clearContent"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="Related channel:" prop="contractBizCodes">
              <el-select v-model="form.contractBizCodes" multiple>
                <el-option
                  v-for="(item, index) in bizCodes"
                  :key="index"
                  :label="item"
                  :value="item"
                ></el-option>
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
          Save
        </el-button>
      </div>
    </el-dialog>
    <!--预先加载在父组件里加载编辑器组件，用v-show隐藏，否则弹出框的编辑器加载滞后-->
    <TinymceEditor v-show="false" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Pagination from '@/components/Pagination'
import {
  contractList,
  contractSave,
  contractEdit,
  contractDelete
} from '@/api/bfs/contactManagement'
import TinymceEditor from '@/components/TinymceEditor'
import { bizCodeList } from '@/api/bas/user'
export default {
  name: 'ImsContractTemplateConfiguration',
  components: { Pagination, TinymceEditor },
  data() {
    return {
      listLoading: false,
      total: 0,
      tableData: [],
      queryConditions: {
        data: {
          contractCode: '',
          contractName: ''
        },
        page: {
          pageNum: 1,
          pageSize: 10
        }
      },
      form: {
        contractCode: '',
        contractType: '',
        contractName: '',
        contractContent: '',
        contractDesc: '',
        contractBizCodes: ''
      },
      rules: {
        contractCode: [
          { required: true, message: 'please enter', trigger: 'blur' },
          { min: 1, message: 'Can not be empty', trigger: 'blur' }
        ],
        contractType: [
          { required: true, message: 'please enter', trigger: 'blur' },
          { min: 1, message: 'Can not be empty', trigger: 'blur' }
        ],
        contractName: [
          { required: true, message: 'please enter', trigger: 'blur' },
          { min: 1, message: 'Can not be empty', trigger: 'blur' }
        ],
        contractDesc: [
          { required: true, message: 'please enter', trigger: 'blur' },
          { min: 1, message: 'Can not be empty', trigger: 'blur' }
        ],
        contractBizCodes: [
          { required: true, message: 'Please select', trigger: 'change' }
        ]
      },
      //判断弹窗是新增，还是修改
      dialogType: 'add',
      dialogFormVisible: false,
      clearContent: false,
      bizCodes: []
    }
  },
  computed: {
    ...mapGetters(['sidebar'])
  },
  created() {
    this.bizCodeList()
  },
  mounted() {
    this.getListItem()
  },
  methods: {
    bizCodeList() {
      bizCodeList({ data: {} })
        .then((res) => {
          this.bizCodes = res.data.bizCodes
        })
        .catch((e) => {})
    },
    dialogClose() {
      this.form = this.$options.data().form
      if (this.$refs['formDom']) {
        this.$refs['formDom'].resetFields()
      }
      this.clearContent = true
      this.dialogFormVisible = false
    },
    getContent(content) {
      this.form.contractContent = content
    },
    AddItem: function () {
      this.dialogType = 'add'
      this.form = this.$options.data().form
      if (this.$refs['formDom']) {
        this.$refs['formDom'].resetFields()
      }
      this.dialogFormVisible = true
    },
    modifyRow: function (row) {
      let newData = JSON.parse(JSON.stringify(row))
      this.form = newData
      this.dialogType = 'modify'
      this.dialogFormVisible = true
      if (newData.contractBizCodes) {
        this.form.contractBizCodes = newData.contractBizCodes.split(',')
      }
    },
    getListItem: function () {
      let _this = this
      _this.listLoading = true
      // 分页逻辑
      contractList(_this.queryConditions)
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
    //刷新
    refreshTable() {
      this.queryConditions.page.pageNum = 1
      this.getListItem()
    },
    checkDetail(row) {
      this.$router.push({
        path: '/cust/AccountDetails',
        query: { productId: row.productId }
      })
    },
    addConfirm(formName) {
      let _this = this
      _this.$refs[formName].validate((valid) => {
        if (valid) {
          if (!_this.form.contractContent) {
            _this.$message({
              showClose: true,
              message: 'Contract content can not be empty!',
              type: 'warning'
            })
            return false
          }
          let data = {
            data: {
              ..._this.form,
              contractBizCodes: this.form.contractBizCodes.join()
            }
          }
          contractSave(data)
            .then((res) => {
              _this.getListItem()
              _this.dialogFormVisible = false
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
    mdfConfirm(formName) {
      let _this = this
      _this.$refs[formName].validate((valid) => {
        if (valid) {
          if (!_this.form.contractContent) {
            _this.$message({
              showClose: true,
              message: 'Contract content can not be empty!',
              type: 'warning'
            })
            return false
          }
          let data = {
            data: {
              ..._this.form,
              contractBizCodes: this.form.contractBizCodes.join()
            }
          }
          contractEdit(data)
            .then((res) => {
              _this.getListItem()
              _this.dialogFormVisible = false
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
    deleteRow(row) {
      let _this = this
      let data = {
        data: {
          contractCode: row.contractCode
        }
      }
      _this
        .$confirm('Confirm deletion？', 'System prompt', {
          confirmButtonText: 'Comfirm',
          cancelButtonText: 'Close',
          type: 'warning'
        })
        .then(() => {
          contractDelete(data)
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
    }
  }
}
</script>

<style scoped lang="scss"></style>
