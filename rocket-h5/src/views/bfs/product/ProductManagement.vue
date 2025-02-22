<!--
	作者：ganshengqu
	时间：2020-02-010
	描述：
-->
<template>
  <div class="table_container">
    <h3>Product management</h3>
    <div class="table_filter clearfix">
      <el-form ref="rateTable" :model="queryConditions.data" :inline="true">
        <el-form-item label="Product name:" prop="productName">
          <el-input v-model="queryConditions.data.productName" />
        </el-form-item>
      </el-form>
      <div class="btn_wrapper" label-width="0">
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
          @click="tableSearch('rateTable')"
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
        <el-table-column label="Product NO." align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.productId }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Product name" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.productName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Product Status" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.status }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Repayment method" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.loanType }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="Whether to allow multiple borrowings"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.multiLoanFlag }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Offset sequence" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.offsetSeq }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Creation time" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.createTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Operator" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.createUser }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Operation" width="450" align="center">
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
              type="primary"
              icon="el-icon-search"
              @click="configurationRow(scope.row)"
            >
              Configuration
            </el-button>
            <el-button
              class="btn btn-default"
              size="mini"
              type="primary"
              icon="el-icon-search"
              @click="
                scope.row.status === 'F'
                  ? ActiveStatus(scope.row)
                  : comfirmForbid(scope.row)
              "
            >
              {{ scope.row.status == 'F' ? 'Activate' : 'Forbid' }}
            </el-button>
            <el-button
              class="btn btn-default"
              size="mini"
              icon="el-icon-delete"
              type="danger"
              @click="deleteRow(scope.row)"
              :disabled="scope.row.status == 'F' ? false : true"
            >
              Delete
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
    </div>
    <!--新增 start-->
    <el-dialog
      :title="dialogType == 'add' ? 'Add product' : 'Modify product'"
      :visible.sync="dialogFormVisible"
      custom-class="dialog_form_wrap"
      :before-close="dialogClose"
      width="60%"
    >
      <el-form
        :model="form"
        class="clearfix"
        :rules="rules"
        ref="form"
        label-width="160px"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="Product category:" prop="productCatagory">
              <el-select v-model="form.productCatagory" placeholder>
                <el-option label="cash" value="cash"></el-option>
                <el-option label="pos Loan" value="commodity"></el-option>
                <el-option label="cash Loan" value="cashloan"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Transaction scenario:" prop="txnScene">
              <el-select v-model="form.txnScene" placeholder>
                <el-option
                  :label="Object.values(item)[0]"
                  :value="Object.keys(item)[0]"
                  v-for="(item, index) in txnSceneList"
                  :key="index"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="Product NO.:" prop="productId">
              <el-input
                v-model="form.productId"
                autocomplete="off"
                :disabled="dialogType == 'add' ? false : true"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Product name :" prop="productName">
              <el-input
                v-model="form.productName"
                autocomplete="off"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="Product description :" prop="productDesc">
              <el-input
                v-model="form.productDesc"
                autocomplete="off"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Product Status:" prop="status">
              <el-select v-model="form.status" placeholder>
                <el-option label="Forbid" value="F"></el-option>
                <el-option label="Creation" value="N"></el-option>
                <el-option label="Activate" value="A"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item
              label="Maximal allowed days to charge penalty interest:"
              prop="maxOverdueDays"
            >
              <el-input
                v-model.number="form.maxOverdueDays"
                autocomplete="off"
                type="number"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Order split config id:" prop="splitConfigId">
              <el-select v-model="form.splitConfigId" placeholder>
                <el-option
                  :label="item.remark"
                  :value="item.id"
                  v-for="(item, index) in splitConfigIdList"
                  :key="index"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="Limit type:" prop="lmtType">
              <el-select v-model="form.lmtType">
                <el-option label="single" value="single"></el-option>
                <el-option label="multiple" value="multiple"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item
              label="Whether to allow multiple borrowings:"
              prop="multiLoanFlag"
            >
              <el-select v-model="form.multiLoanFlag" placeholder>
                <el-option label="Yes" value="Y"></el-option>
                <el-option label="No" value="N"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Offset sequence：" prop="offsetSeq">
              <el-input
                v-model.number="form.offsetSeq"
                autocomplete="off"
                type="number"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="Repayment method :" prop="loanType">
              <el-select v-model="form.loanType" placeholder>
                <el-option label="EPI" value="EPI"></el-option>
                <el-option label="WFI" value="WFI"></el-option>
                <el-option label="DRI" value="DRI"></el-option>
                <el-option label="OOP" value="OOP"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Account type:" prop="acctType">
              <el-select v-model="form.acctType" placeholder>
                <el-option
                  :label="Object.values(item)[0]"
                  :value="Object.keys(item)[0]"
                  v-for="(item, index) in acctTypeList"
                  :key="index"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Limit factor:" prop="lmtRate">
              <el-input
                v-model.number="form.lmtRate"
                autocomplete="off"
                type="number"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="Hesitation period :" prop="coolingOffPeriod">
              <el-input
                v-model="form.coolingOffPeriod"
                autocomplete="off"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="No.of contract template:" prop="contractCode">
              <el-select
                v-model="form.contractCode"
                placeholder="Please select"
              >
                <el-option
                  :label="item.contractName"
                  :value="item.contractCode"
                  v-for="(item, index) in contractlList"
                  :key="index"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="Min Product Price:">
              <el-input
                v-model="form.minProductPrice"
                autocomplete="off"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Max Product Price:">
              <el-input
                v-model="form.maxProductPrice"
                autocomplete="off"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="Min Loan Amount:">
              <el-input
                v-model="form.minLoanAmount"
                autocomplete="off"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Max Loan Amount:">
              <el-input
                v-model="form.maxLoanAmount"
                autocomplete="off"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="Min Downpayment Ratio:">
              <el-input
                v-model="form.minDownpaymentRatio"
                autocomplete="off"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12"></el-col>
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
    <!--新增 end-->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Pagination from '@/components/Pagination'
import {
  productPageList,
  productAdd,
  productModify,
  productDelete,
  productVisible,
  productDisable,
  queryProductRelEnum
} from '@/api/bfs/productManagement'
import { orderSplitQueryAllList } from '@/api/bfs/splittingAndWithholdingManagement'
import { contractQueryAllList } from '@/api/bfs/contract'
import { offsetQueryAllList } from '@/api/bfs/offsetManagement'
import { productAcctTypeList } from '@/api/bfs/acctType'
import { compareTwoObjects } from '@/utils/index'
export default {
  name: 'BfsProductManagement',
  components: { Pagination },
  data() {
    return {
      listLoading: false,
      dialogFormVisible: false,
      total: 0,
      tableData: [],
      queryConditions: {
        data: {
          status: '',
          loanType: '',
          productName: ''
        },
        page: {
          pageNum: 1,
          pageSize: 10
        }
      },
      form: {
        productCatagory: '',
        txnScene: '',
        productId: '',
        productName: '',
        productDesc: '',
        status: '',
        maxOverdueDays: null,
        splitConfigId: '',
        multiLoanFlag: '',
        offsetSeq: null,
        loanType: '',
        acctType: '',
        lmtRate: '',
        lmtType: '',
        coolingOffPeriod: '',
        contractCode: '',
        minProductPrice: '',
        maxProductPrice: '',
        minLoanAmount: '',
        maxLoanAmount: '',
        minDownpaymentRatio: ''
      },
      splitConfigIdList: [],
      acctTypeList: [],
      txnSceneList: [],
      //表单校验规则
      rules: {
        productCatagory: [
          { required: true, message: 'Please select', trigger: 'change' }
        ],
        txnScene: [
          { required: true, message: 'Please select', trigger: 'change' }
        ],
        productId: [
          { required: true, message: 'please enter', trigger: 'blur' },
          { min: 1, message: 'Can not be empty', trigger: 'blur' }
        ],
        status: [
          { required: true, message: 'Please select', trigger: 'change' }
        ],
        productName: [
          { required: true, message: 'please enter', trigger: 'blur' },
          { min: 1, message: 'Can not be empty', trigger: 'blur' }
        ],
        productDesc: [
          { required: true, message: 'please enter', trigger: 'blur' },
          { min: 1, message: 'Can not be empty', trigger: 'blur' }
        ],
        maxOverdueDays: [
          {
            required: true,
            type: 'number',
            message: 'please enter',
            trigger: 'blur'
          }
        ],
        splitConfigId: [
          { required: true, message: 'Please select', trigger: 'change' }
        ],
        multiLoanFlag: [
          { required: true, message: 'Please select', trigger: 'change' }
        ],
        offsetSeq: [
          {
            required: true,
            type: 'number',
            message: 'please enter',
            trigger: 'blur'
          }
        ],
        loanType: [
          { required: true, message: 'Please select', trigger: 'change' }
        ],
        coolingOffPeriod: [
          { required: true, message: 'please enter', trigger: 'blur' },
          { min: 1, message: 'Can not be empty', trigger: 'blur' }
        ],
        contractCode: [
          { required: true, message: 'Please select', trigger: 'change' }
        ],
        acctType: [
          { required: true, message: 'Please select', trigger: 'change' }
        ],
        lmtType: [
          { required: true, message: 'Please select', trigger: 'change' }
        ],
        lmtRate: [{ required: true, message: 'Please select', trigger: 'blur' }]
      },
      //判断弹窗是新增，还是修改
      dialogType: 'add',
      contractlList: []
    }
  },
  computed: {
    ...mapGetters(['sidebar'])
  },
  watch: {},
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
    ActiveStatus(row) {
      let _this = this
      let data = {
        data: {
          productId: row.productId
        }
      }
      productVisible(data)
        .then((res) => {
          _this.getListItem()
        })
        .catch((e) => {
          console.log('error')
        })
    },
    comfirmForbid(row) {
      let _this = this
      let data = {
        data: {
          productId: row.productId
        }
      }
      productDisable(data)
        .then((res) => {
          _this.getListItem()
        })
        .catch((e) => {
          console.log('error')
        })
    },
    //查询下拉选择框的配置
    getSelectionData() {
      //查询所有的代扣拆分配置
      let _this = this
      orderSplitQueryAllList()
        .then((res) => {
          _this.splitConfigIdList = res.data
        })
        .catch((e) => {
          console.log('error')
        })
      //查询所有的账户类型
      productAcctTypeList()
        .then((res) => {
          //处理成数组
          var arr = []
          let getObj = res.data
          for (let i in getObj) {
            let o = {}
            o[i] = getObj[i]
            arr.push(o)
          }
          _this.acctTypeList = arr
        })
        .catch((e) => {
          console.log('error')
        })
      //查询出多个枚举值
      queryProductRelEnum()
        .then((res) => {
          //处理成数组
          var arr = []
          let getObj = res.data.txnScene
          for (let i in getObj) {
            let o = {}
            o[i] = getObj[i]
            arr.push(o)
          }
          _this.txnSceneList = arr
        })
        .catch((e) => {
          console.log('error')
        })
      //合同列表查询
      let contractReqData = {
        data: {
          contractCode: '',
          contractName: ''
        },
        page: {
          pageNum: 1,
          pageSize: 50,
          totalRecord: 24,
          totalPage: 3,
          startIndex: 1
        }
      }
      contractQueryAllList(contractReqData)
        .then((res) => {
          _this.contractlList = res.data
        })
        .catch((e) => {
          console.log('error')
        })
    },
    AddItem: function () {
      this.dialogType = 'add'
      this.form = this.$options.data().form
      if (this.$refs['form']) {
        this.$refs['form'].resetFields()
      }
      this.dialogFormVisible = true
      this.getSelectionData()
    },
    modifyRow: function (row) {
      let newData = JSON.parse(JSON.stringify(row))
      newData.coolingOffPeriod = String(newData.coolingOffPeriod)
      this.form = newData
      this.dialogType = 'modify'
      this.dialogFormVisible = true
      this.getSelectionData()
    },
    configurationRow: function (row) {
      this.$router.push({
        path: '/operationMgt/BasicProductInformation',
        query: { productId: row.productId }
      })
    },
    deleteRow: function (row) {
      let _this = this
      let data = {
        data: {
          productId: row.productId
        }
      }
      _this
        .$confirm('Confirm deletion of this product?', 'System prompt', {
          confirmButtonText: 'Confirm',
          cancelButtonText: 'Close',
          type: 'warning'
        })
        .then(() => {
          productDelete(data)
            .then((res) => {
              _this.$message({
                type: 'success',
                message: 'successfully deleted!'
              })
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
      productPageList(_this.queryConditions)
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
    tableSearch(formName) {
      let _this = this
      _this.$refs[formName].validate((valid) => {
        if (valid) {
          _this.getListItem()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    //增加产品配置信息
    comfirmAdd(formName) {
      let _this = this
      _this.$refs[formName].validate((valid) => {
        if (valid) {
          _this.form.coolingOffPeriod = Number(_this.form.coolingOffPeriod)
          let data = {
            data: _this.form
          }
          productAdd(data)
            .then((res) => {
              _this.dialogFormVisible = false
              //添加成功，刷新列表
              _this.getListItem()
            })
            .catch((e) => {
              //_this.dialogFormVisible = false;
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    //刷新
    refreshTable() {
      this.getListItem()
    },
    //修改
    comfirmMdf(formName) {
      let _this = this
      _this.$refs[formName].validate((valid) => {
        if (valid) {
          let data = {
            data: _this.form
          }
          productModify(data)
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
    }
  }
}
</script>

<style scoped lang="scss"></style>
