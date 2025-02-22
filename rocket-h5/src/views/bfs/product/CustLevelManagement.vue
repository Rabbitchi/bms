<template>
  <div class="table_container">
    <h3>Cust level management</h3>
    <div class="table_filter clearfix">
      <el-form ref="rateTable" :model="queryConditions.data" :inline="true">
        <el-form-item label="Product name:" prop="productName">
          <el-input v-model="queryConditions.data.productName" maxLength="50" />
        </el-form-item>
        <el-form-item label="Cust Level:" prop="custLevel">
          <el-input v-model="queryConditions.data.custLevel" />
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
        <el-table-column label="Cust Level" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="modifyRow(scope.row)">
              {{ scope.row.custLevel }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="Product NO." align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="configurationRow(scope.row)">
              {{ scope.row.productId }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="Product name" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.productName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Pricing NO." align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="configurationRow(scope.row, 1)">
              {{ scope.row.productFeeId }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="Terms" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.term }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Interest rate table" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Create time" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.createTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Operatior" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.createUser }}</span>
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
            <el-form-item label="Cust Level :" prop="custLevel">
              <el-input
                v-model="form.custLevel"
                onkeyup="value=this.value.replace(/[^\w_-]/g,'');"
                autocomplete="off"
                maxLength="50"
                :disabled="dialogType === 'modify'"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="Related product :">
              <el-scrollbar style="height: 450px">
                <el-tree
                  :data="products"
                  show-checkbox
                  default-expand-all
                  node-key="productFeeId"
                  ref="tree"
                  highlight-current
                  :props="defaultProps"
                ></el-tree>
              </el-scrollbar>
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
    <!--新增 end-->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Pagination from '@/components/Pagination'
import {
  custLevelList,
  custLevelAdd,
  custLevelModify,
  productIncludeChildren,
  custLevelProductFeeList
} from '@/api/bfs/custLeveManagement'
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
          custLevel: '',
          productName: ''
        },
        page: {
          pageNum: 1,
          pageSize: 10
        }
      },
      form: {
        custLevel: ''
      },
      //表单校验规则
      rules: {
        custLevel: [
          { required: true, message: 'Please select', trigger: 'change' }
        ]
      },
      //判断弹窗是新增，还是修改
      dialogType: 'add',
      products: [],
      defaultProps: {
        children: 'productFees',
        label: 'itemName'
      }
    }
  },
  computed: {
    ...mapGetters(['sidebar'])
  },
  watch: {},
  mounted() {
    this.getListItem()
    this.productIncludeChildren()
  },
  methods: {
    productIncludeChildren() {
      productIncludeChildren()
        .then((res) => {
          this.products = res.data.products
        })
        .catch((e) => {
          console.log('error')
        })
    },
    dialogClose() {
      this.dialogFormVisible = false
      if (this.$refs['form']) {
        this.$refs['form'].resetFields()
      }
    },
    AddItem() {
      this.dialogType = 'add'
      this.form = this.$options.data().form
      if (this.$refs['form']) {
        this.$refs['form'].resetFields()
      }
      this.dialogFormVisible = true
      this.$refs.tree.setCheckedKeys([]) // 弹出层之后，否则报错
    },
    modifyRow(row) {
      this.form.custLevel = row.custLevel
      this.dialogType = 'modify'
      this.dialogFormVisible = true
      custLevelProductFeeList({ data: { custLevel: row.custLevel } })
        .then((res) => {
          this.$refs.tree.setCheckedKeys(res.data.productFeeIdList)
        })
        .catch((e) => {
          this.$refs.tree.setCheckedKeys([])
          console.log('error')
        })
    },
    configurationRow(row, index) {
      this.$router.push({
        path: '/operationMgt/BasicProductInformation',
        query: {
          productId: row.productId,
          productFeeId: index ? row.productFeeId : undefined
        }
      })
    },
    getListItem() {
      this.listLoading = true
      // 分页逻辑
      custLevelList(this.queryConditions)
        .then((res) => {
          this.listLoading = false
          if (res.data) {
            this.setTableData(res)
          } else {
            this.tableData = []
            this.total = 0
          }
        })
        .catch((e) => {
          this.listLoading = false
        })
    },
    setTableData(data) {
      this.tableData = data.data.custLevelList
      this.total = data.page.totalRecord
      this.$nextTick()
      this.$refs.table.bodyWrapper.scrollTop = 0
    },
    resetForm() {
      this.$refs['rateTable'].resetFields()
      this.$refs.tree.setCheckedKeys([])
      this.getListItem()
    },
    tableSearch(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.getListItem()
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
    //增加产品配置信息
    comfirmAdd(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let productFeeIdList = []
          if (this.$refs.tree.getCheckedKeys().length > 0) {
            this.$refs.tree.getCheckedKeys().forEach((item) => {
              if (item) {
                productFeeIdList.push(item)
              }
            })
          }
          const params = {
            data: {
              ...this.form,
              productFeeIdList: productFeeIdList
            }
          }
          custLevelAdd(params)
            .then((res) => {
              this.dialogFormVisible = false
              this.getListItem()
            })
            .catch((e) => {
              //this.dialogFormVisible = false;
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    //修改
    comfirmMdf(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let productFeeIdList = []
          if (this.$refs.tree.getCheckedKeys().length > 0) {
            this.$refs.tree.getCheckedKeys().forEach((item) => {
              if (item) {
                productFeeIdList.push(item)
              }
            })
          }
          const params = {
            data: {
              ...this.form,
              productFeeIdList: productFeeIdList
            }
          }
          custLevelModify(params)
            .then((res) => {
              this.dialogFormVisible = false
              this.$refs.tree.setCheckedKeys([])
              this.getListItem()
            })
            .catch((e) => {
              this.dialogFormVisible = false
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
