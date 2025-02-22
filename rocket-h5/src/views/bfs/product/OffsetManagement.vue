<!--
	作者：ganshengqu
	时间：2020-02-04
	描述：
-->
<template>
  <div class="table_container">
    <h3>Offset management</h3>
    <div class="table_filter clearfix">
      <el-form
        ref="rateTable"
        :model="queryConditions.data"
        :inline="true"
        label-position="left"
      >
        <el-form-item label="Offset definition name:" prop="name">
          <el-input v-model="queryConditions.data.name" />
        </el-form-item>
      </el-form>
      <div class="btn_wrapper" label-width="0">
        <el-button
          class="btn"
          type="primary"
          icon="el-icon-plus"
          @click="AddItem"
        >
          Add
        </el-button>
        <el-button
          class="btn"
          @click="refreshTable"
          icon="el-icon-refresh-right"
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
      <!--表格  start-->
      <el-table
        ref="table"
        class="table"
        v-loading="listLoading"
        :data="tableData"
        border
        stripe
        empty-text="No data under current query"
      >
        <el-table-column label="No.of offset definition" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.offsetId }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Account age" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.aging }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Offset definition name" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.offsetName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Offset definition description" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.offsetDesc }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Operation" width="380" align="center">
          <template slot-scope="scope">
            <el-button
              class="btn btn-default"
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="modifyRow(scope.row)"
            >
              Modify
            </el-button>
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
              @click="checkDetails(scope.row)"
            >
              Offset details
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--表格  end-->
      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="queryConditions.page.pageNum"
        :limit.sync="queryConditions.page.pageSize"
        @pagination="getListItem()"
      />
      <!--新增、修改弹窗 start-->
      <el-dialog
        :title="
          dialogType == 'add'
            ? 'Add offset definition'
            : 'Modify offset definition'
        "
        :visible.sync="dialogFormVisible"
        width="60%"
        :before-close="dialogClose"
        custom-class="dialog_form_wrap"
      >
        <el-form
          :model="form"
          label-width="160px"
          class="clearfix"
          :rules="rules"
          ref="form"
        >
          <el-row>
            <el-col :span="12">
              <el-form-item label="Account age :" prop="aging">
                <el-input
                  v-model="form.aging"
                  autocomplete="off"
                  type="number"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="Offset definition name :" prop="offsetName">
                <el-input
                  v-model="form.offsetName"
                  autocomplete="off"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item
                label="Offset definition description:"
                prop="offsetDesc"
              >
                <el-input
                  v-model="form.offsetDesc"
                  autocomplete="off"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button
            type="primary"
            @click="
              dialogType === 'add' ? comfirmAdd('form') : comfirmMdf('form')
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
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Pagination from '@/components/Pagination'
import {
  pageOffsetList,
  offsetAdd,
  offsetModify,
  offsetDelete
} from '@/api/bfs/offsetManagement'
export default {
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
      //表单校验规则
      rules: {
        aging: [
          { required: true, message: 'please enter', trigger: 'blur' },
          { min: 1, message: 'Can not be empty', trigger: 'blur' }
        ],
        offsetDesc: [
          { required: true, message: 'please enter', trigger: 'blur' },
          { min: 1, message: 'Can not be empty', trigger: 'blur' }
        ],
        offsetName: [
          { required: true, message: 'please enter', trigger: 'blur' },
          { min: 1, message: 'Can not be empty', trigger: 'blur' }
        ]
      },
      form: {
        aging: null,
        offsetName: '',
        offsetDesc: ''
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
      if (this.$refs['form']) {
        this.$refs['form'].resetFields()
      }
    },
    AddItem: function () {
      this.dialogType = 'add'
      this.form = this.$options.data().form
      if (this.$refs['form']) {
        this.$refs['form'].resetFields()
      }
      this.dialogFormVisible = true
    },
    modifyRow: function (row) {
      let newData = JSON.parse(JSON.stringify(row))
      delete newData.updateTime
      delete newData.createTime
      newData.aging = String(newData.aging)
      this.form = newData
      this.dialogType = 'modify'
      this.dialogFormVisible = true
    },
    deleteRow: function (row) {
      let _this = this
      let data = {
        data: {
          offsetId: row.offsetId
        }
      }
      _this
        .$confirm(
          'Confirm deletion of offset definition information?',
          'System prompt',
          {
            confirmButtonText: 'Comfirm',
            cancelButtonText: 'Close',
            type: 'warning'
          }
        )
        .then(() => {
          offsetDelete(data)
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
      pageOffsetList(_this.queryConditions)
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
    //添加冲销配置
    comfirmAdd(formName) {
      let _this = this
      _this.$refs[formName].validate((valid) => {
        if (valid) {
          _this.form.aging = Number(_this.form.aging)
          let data = {
            data: _this.form
          }
          offsetAdd(data)
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
    //刷新
    refreshTable() {
      this.queryConditions.page.pageNum = 1
      this.getListItem()
    },
    //修改
    comfirmMdf(formName) {
      let _this = this
      _this.$refs[formName].validate((valid) => {
        if (valid) {
          _this.form.aging = Number(_this.form.aging)
          let data = {
            data: _this.form
          }
          offsetModify(data)
            .then((res) => {
              _this.dialogFormVisible = false
              //添加成功，刷新列表
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
    //查看详情
    checkDetails(row) {
      this.$router.push({
        path: '/operationMgt/OffsetSequencingMgt',
        query: { id: row.offsetId }
      })
    }
  }
}
</script>

<style scoped lang="scss"></style>
